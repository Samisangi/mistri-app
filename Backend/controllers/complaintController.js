const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const { subject, message, category, relatedOrderId } = req.body;

    const complaint = await Complaint.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      subject,
      message,
      category,
      relatedOrderId: relatedOrderId || undefined
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin only
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate('userId', 'name email role')
      .populate('relatedOrderId', 'gigId')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.respondToComplaint = async (req, res) => {
  try {
    const { adminResponse, status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        adminResponse,
        status: status || 'resolved',
        respondedAt: new Date()
      },
      { new: true }
    );

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};