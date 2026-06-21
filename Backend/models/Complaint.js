const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String },
  userRole: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ['complaint', 'support', 'feedback', 'payment_issue', 'other'],
    default: 'support'
  },
  relatedOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  adminResponse: { type: String },
  respondedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);