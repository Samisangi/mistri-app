const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const ctrl = require('../controllers/complaintController');

router.post('/', protect, ctrl.createComplaint);
router.get('/my', protect, ctrl.getMyComplaints);
router.get('/', protect, roleCheck('admin'), ctrl.getAllComplaints);
router.put('/:id/respond', protect, roleCheck('admin'), ctrl.respondToComplaint);

module.exports = router;