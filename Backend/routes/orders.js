const router = require('express').Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

router.post('/', protect, ctrl.createOrder);
router.get('/my', protect, ctrl.getMyOrders);
router.put('/:id/status', protect, ctrl.updateOrderStatus);

module.exports = router;