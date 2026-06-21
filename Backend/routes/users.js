const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { updateProfile, changePassword } = require('../controllers/userController');

router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;