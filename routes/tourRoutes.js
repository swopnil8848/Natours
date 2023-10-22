const express = require('express')
const fs = require('fs')
const router = express.Router();
const authController = require('./../controllers/authController')
const reviewController = require('./../controllers/reviewController')

const tourController = require('./../controllers/tourController');

const reviewRouter = require('./../routes/reviewRoute')
// chek this one more often why this is working...........................................
// param function
// router.param('id',tourController.checkID);

// router
//     .route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview
//     );

router.use('/:tourId/reviews',reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours)

router
    .route('/tour-stats')
    .get(tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin','lead-fuide','guide'),
        tourController.getMonthlyPlan
    );
    
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)
// /tours-distance/distance=223&center=-40,45&unit=km
// /tours-distance/223/center/-40,45/unit/km

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.createTour
    )
    
router
    .route('/:id')
    .get(tourController.getTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin','lead-fuide'),
        tourController.deleteTour
    )
    .patch(
        authController.protect,
        authController.restrictTo('admin','lead-fuide'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour
    )

// router
//     .route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview
//     );

module.exports = router;