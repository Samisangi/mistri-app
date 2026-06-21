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
     const io = req.app.get('io');
    io.to(receiverId.toString()).emit('new_message_notification', {
      senderName: req.user.name,
      content,
      receiverId: receiverId.toString(),
      orderId
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark messages as read for an order
router.put('/:orderId/read', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { orderId: req.params.orderId, receiverId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get total unread count for the logged-in user
router.get('/unread/count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiverId: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get unread count per conversation/order for the logged-in user
router.get('/unread/by-order', protect, async (req, res) => {
  try {
    const unread = await Message.aggregate([
      { $match: { receiverId: req.user._id, read: false } },
      { $group: { _id: '$orderId', count: { $sum: 1 } } }
    ]);
    res.json(unread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;