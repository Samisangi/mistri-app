const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  mistriId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  mistriName: { type: String },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Plumbing', 'Electrician', 'Painting', 'Furniture', 'AC & Appliance', 'General'],
    required: true 
  },
  description: { type: String, required: true },
  images: [String],
  packages: {
    basic: {
      price: { type: Number, required: true },
      deliveryDays: { type: Number, required: true },
      description: { type: String }
    }
  },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);