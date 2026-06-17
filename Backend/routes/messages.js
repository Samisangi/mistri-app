const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');

router.get('/:orderId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ orderId: req.params.orderId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { orderId, receiverId, content } = req.body;
    const message = await Message.create({
      orderId,
      senderId: req.user._id,
      receiverId,
      content
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;