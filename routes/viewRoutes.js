const express = require('express')
const viewsController = require('../controllers/viewsController')
const router = express.Router();
const authController = require('../controllers/authController')

// router.use(authController.isLoggedIn)

router.get('/',authController.isLoggedIn,viewsController.getOverview)
router.get('/tours/:slug',authController.isLoggedIn,viewsController.getTour)
router.get('/login',authController.isLoggedIn,viewsController.getLoginForm)
router.get('/signup',viewsController.getSignupForm)
router.get('/me',authController.protect,viewsController.getAccount);
router.post('/submit-user-data',authController.protect,viewsController.updateUserdata)
module.exports = router