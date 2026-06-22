const Gig = require('../models/Gig');

exports.getAllGigs = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { active: true };
    if (category && category !== 'all') query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];

    let sortObj = {};
    if (sort === 'price-low') sortObj = { 'packages.basic.price': 1 };
    else if (sort === 'price-high') sortObj = { 'packages.basic.price': -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'popular') sortObj = { orders: -1 };

    const gigs = await Gig.find(query).sort(sortObj).populate('mistriId', 'name avatar rating');
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('mistriId', 'name avatar rating totalReviews');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createGig = async (req, res) => {
  try {
    const gig = await Gig.create({
      ...req.body,
      mistriId: req.user._id,
      mistriName: req.user.name
    });
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findOneAndUpdate(
      { _id: req.params.id, mistriId: req.user._id },
      req.body,
      { new: true }
    );
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGig = async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? { _id: req.params.id }
      : { _id: req.params.id, mistriId: req.user._id };

    const gig = await Gig.findOneAndDelete(query);
    if (!gig) return res.status(404).json({ message: 'Gig not found or not authorized' });

    res.json({ message: 'Gig deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ mistriId: req.user._id });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};