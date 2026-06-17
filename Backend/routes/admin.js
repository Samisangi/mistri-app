const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const User = require('../models/User');
const Order = require('../models/Order');

router.get('/users', protect, roleCheck('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id', protect, roleCheck('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders', protect, roleCheck('admin'), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('clientId', 'name email')
      .populate('mistriId', 'name email')
      .populate('gigId', 'title')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;