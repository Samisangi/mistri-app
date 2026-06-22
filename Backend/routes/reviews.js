const router = require('express').Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/reviewController');

router.post('/', protect, ctrl.createReview);
router.get('/user/:userId', ctrl.getUserReviews);
router.get('/gig/:gigId', ctrl.getGigReviews);
router.get('/check/:orderId', protect, ctrl.checkReviewStatus);

module.exports = router;