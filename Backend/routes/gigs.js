const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const ctrl = require('../controllers/gigController');

router.get('/', ctrl.getAllGigs);
router.get('/my', protect, roleCheck('mistri'), ctrl.getMyGigs);
router.get('/:id', ctrl.getGigById);
router.post('/', protect, roleCheck('mistri'), ctrl.createGig);
router.put('/:id', protect, roleCheck('mistri'), ctrl.updateGig);
router.delete('/:id', protect, roleCheck('mistri', 'admin'), ctrl.deleteGig);

module.exports = router;