const revivewController = require('./../controllers/reviewController')
const express = require('express')
const router = express.Router({mergeParams:true}); // this will give acess to the tourId of tourRoutes.js
const authController = require('./../controllers/authController')

router.use(authController.protect);

router.route('/')
    .get(revivewController.getAllReview)    
    .post(
        authController.restrictTo('user'),
        revivewController.setTourUsersIds,
        revivewController.createReview
    );

router
    .route('/:id')
    .get(revivewController.getReview)
    .patch(
        authController.restrictTo('user','admin'),
        revivewController.updateReview
    )
    .delete(
        authController.restrictTo('user','admin'),
        revivewController.deleteReview
    )
    
module.exports = router;