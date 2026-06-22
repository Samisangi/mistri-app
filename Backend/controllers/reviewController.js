const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');
const Gig = require('../models/Gig');

exports.createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed orders' });
    }

    const isClient = order.clientId.toString() === req.user._id.toString();
    const isMistri = order.mistriId.toString() === req.user._id.toString();

    if (!isClient && !isMistri) {
      return res.status(403).json({ message: 'Not authorized to review this order' });
    }

    // Determine who is being reviewed
    const revieweeId = isClient ? order.mistriId : order.clientId;

    // Check if already reviewed
    const existing = await Review.findOne({ orderId, reviewerId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this order' });
    }

    const review = await Review.create({
      orderId,
      gigId: order.gigId,
      reviewerId: req.user._id,
      reviewerName: req.user.name,
      reviewerRole: req.user.role,
      revieweeId,
      rating,
      comment
    });

    // Update reviewee's average rating
    const allReviews = await Review.find({ revieweeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      rating: parseFloat(avgRating.toFixed(1)),
      totalReviews: allReviews.length
    });

    // If reviewing a mistri, also update their gig's rating
    if (isClient && order.gigId) {
      const gigReviews = await Review.find({ gigId: order.gigId, reviewerRole: 'client' });
      const gigAvgRating = gigReviews.reduce((sum, r) => sum + r.rating, 0) / gigReviews.length;

      await Gig.findByIdAndUpdate(order.gigId, {
        rating: parseFloat(gigAvgRating.toFixed(1)),
        reviews: gigReviews.length
      });
    }

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this order' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Get reviews received by a specific user (mistri or client profile page)
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name avatar')
      .populate('gigId', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reviews for a specific gig
exports.getGigReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId, reviewerRole: 'client' })
      .populate('reviewerId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check if current user has already reviewed this order
exports.checkReviewStatus = async (req, res) => {
  try {
    const review = await Review.findOne({
      orderId: req.params.orderId,
      reviewerId: req.user._id
    });
    res.json({ hasReviewed: !!review, review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};