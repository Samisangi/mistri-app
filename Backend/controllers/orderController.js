const Order = require('../models/Order');
const Gig = require('../models/Gig');

exports.createOrder = async (req, res) => {
  try {
    const { gigId, address, notes } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    const order = await Order.create({
      clientId: req.user._id,
      mistriId: gig.mistriId,
      gigId,
      price: gig.packages.basic.price,
      address,
      notes
    });

    await Gig.findByIdAndUpdate(gigId, { $inc: { orders: 1 } });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const query = req.user.role === 'client' 
      ? { clientId: req.user._id }
      : { mistriId: req.user._id };

    const orders = await Order.find(query)
      .populate('gigId', 'title category images')
      .populate('clientId', 'name phone')
      .populate('mistriId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only client or mistri involved in this order can cancel
    const isClient = order.clientId.toString() === req.user._id.toString();
    const isMistri = order.mistriId.toString() === req.user._id.toString();

    if (!isClient && !isMistri) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Don't allow cancelling completed orders
    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed order' });
    }

    order.status = 'cancelled';
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};