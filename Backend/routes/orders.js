const router = require('express').Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

router.post('/', protect, ctrl.createOrder);
router.get('/my', protect, ctrl.getMyOrders);
router.put('/:id/status', protect, ctrl.updateOrderStatus);
// Add this route for inquiry/contact
router.post('/inquiry', protect, async (req, res) => {
  try {
    const { gigId } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Check if inquiry already exists
    const existing = await Order.findOne({
      clientId: req.user._id,
      gigId,
      status: 'inquiry'
    }).populate('gigId', 'title').populate('mistriId', 'name').populate('clientId', 'name');

    if (existing) {
      return res.status(400).json({ message: 'Inquiry exists', orderId: existing._id });
    }

    const order = await Order.create({
      clientId: req.user._id,
      mistriId: gig.mistriId,
      gigId,
      price: 0,
      status: 'inquiry',
      paymentStatus: 'unpaid'
    });

    const populated = await Order.findById(order._id)
      .populate('gigId', 'title')
      .populate('mistriId', 'name')
      .populate('clientId', 'name');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;