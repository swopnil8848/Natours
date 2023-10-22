const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find({});

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});
// exports.getTour = catchAsync( async(req,res,next)=>{
//     // 1) get the data, fro the requrested tour (including review)
//     console.log(req.params.slug,"this is tours.params.slug");
//     const tour =await Tour.findOne({slug: req.params.slug}).populate({
//         path:'reviews',
//         fields:'review rating user'
//     })
    
//     // 2) Build template

//     // 3)render template using data from 1)
//     res
//     .status(200)
//     .set(
//         'Content-Security-Policy',
//         "connect-src 'self' https://cdnjs.cloudflare.com"
//       )
//     .render('tour', {
//       title: `${tour.name} Tour`,
//       tour
//     });
// });

// exports.getLoginForm = (req,res)=>{


//     res.status(200).render('login',{
//         title: 'Log into your account',
//         user
//     })
// }

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'reviews rating user',
    });
    if(!tour){
      return next(new AppError('There is no tour with that name'))
    }
    res
      .status(200)
      .set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      )
      .render('tour', {
        title: `${tour.name}`,
        tour,
      });
  });
   
  exports.getLoginForm = (req, res) => {
    res
      .status(200)
      .set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
      )
      .render('login', {
        title: 'User Login',
      });
  };

  exports.getSignupForm = (req, res) => {
    res
      .status(200)
      .set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
      )
      .render('signup', {
        title: 'User SignUp',
      });
  };

  exports.getAccount = (req,res)=>{
    res
      .status(200)
      .render('account', {
        title:'Your account'
      });
  } 

exports.updateUserdata =catchAsync(async (req,res,next)=>{
  const updatedUser = await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email: req.body.email
  },{
    new: true,
    runValidators: true
  });

  res.status(200).render('account',{
    title: 'Your account',
    user: updatedUser
  });
})