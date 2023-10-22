
const crypto = require('crypto')
const  Email  = require('./../utils/email');
const { promisify } = require('util');
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')


const signToken = id =>{
    return jwt.sign({ id },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user,statusCode,res)=>{
  const token = signToken(user._id);

  const CookieOptions = {
    expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
    httpOnly:true
  }

  if(process.env.NODE_ENV==='production') CookieOptions.secure =true;

  res.cookie('jwt',token,CookieOptions);

  // remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status:'succes',
    token,
    data:{user}
  })
}

exports.singup = catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt 
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    // console.log(url);
    await new Email(newUser,url).sendWelcome();

    createSendToken(newUser,201,res);
});

exports.login =catchAsync( async (req,res,next) => {
    const {email,password} = req.body;

    // check if password and email exists
    if(!email||!password){
        return next(new AppError('please enter the email and password'))
    }

    //2) check if user exists && password is correct
    const user =await User.findOne({email}).select('+password')

    if(!user || !await user.correctPassword(password,user.password)){
        return next(new AppError('Incorrect email or password',401))
    }

    //3) of everythin ok, send token to client
    createSendToken(user,200,res);
})

exports.logout = (req,res,next)=>{
  res.cookie('jwt','logged out',{
    expires:new Date(Date.now()+10*1000),
    httpOnly:true
  });
  res.status(200).json({status:'sucess'});
}

exports.protect = catchAsync(async (req,res,next)=>{
    //1) getting token and check if it's there\
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if(!token){
        return next(new AppError('you are not logged in! please log in to get acess',401))
    } 

    //2) verification token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    // console.log("decoded::>>",decoded)

    //3) check if user still exists
    const freshUser = await User.findById(decoded.id)
    
    if(!freshUser){
        return next(
            new AppError('the user belonging to this token does no longer exist',401)
        )
    }

    //4)check if user cahnged passwordd after the jwt was issued
    // iat = issued at
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('user recently changed password please log in again',401))
    }

    // grant acess to protected route
    req.user = freshUser;
    res.locals.user = freshUser;
    next();
});


// only for rendered pages, no errors!!
exports.isLoggedIn = async (req,res,next)=>{
  try{

  
  if(req.cookies.jwt){
    // 1) verify the token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET)
  
    // console.log(decoded)

  //2) check if user still exists
  const freshUser = await User.findById(decoded.id)
  
  if(!freshUser){
      return next()
  }

  //3)check if user cahnged passwordd after the jwt was issued
  // iat = issued at
  if(freshUser.changedPasswordAfter(decoded.iat)){
      return next()
  }

  // THERE IS A LOGGED IN USER
  res.locals.user = freshUser
  return next();
}
}catch(err){
  return next();
}
  next();
};


exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        // roles ['admin','lead-guide']. role='user' 
        if(!roles.includes(req.user.role)){
            return next(new AppError('you do not have permission to perform this action',403))
        };
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
  
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  
    
    try {
      // 3) Send it to user's email
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;

      await new Email(user,resetURL).sendPasswordResest();
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    //  console.log('err:',err);
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  });
  
  exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
      const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // we have deifned pre function in usermodel to set passwordChangedAt property in database(check it out)

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    // createSendToken(user, 200, res);
    createSendToken(user,200,res);

  });

  exports.updatePassword = catchAsync(async (req,res,next)=>{
    // 1) get iser from collection
    // we are storing our id in protect function in this same application as req.body = freshUser(try console.log(decoded) in there if you dont understand in future)
    
    const user = await User.findById(req.user.id).select('+password')
    // console.log("the id is how",user)
    //2) check if POSted current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
      return next(new AppError('your current password is wrong',401))
    }

    //3) if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    //user.findByIDAndUpdate wont work here

    //4)log user in, send JWT
    createSendToken(user,200,res);
  })

