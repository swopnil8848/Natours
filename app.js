const path = require('path');
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes')
const globalErrorHandler = require('./controllers/errorController')
const reviewRouter = require('./routes/reviewRoute')
const bookingRouter = require('./routes/bookingRoutes')
const viewRouter = require('./routes/viewRoutes')
const AppError = require('./utils/AppError')

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'))

// this is kind of new type of middle ware
// this helps us acess the static files in our folder
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname,'public')));

// global middlewares
//set security HTTP helment
app.use(helmet({ contentSecurityPolicy: false }));



//DEVELOPMENT LOGIN
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

//limited requests from same API
const limiter = rateLimit({
    max:100,
    windowMs:60*60*100,
    message:'too many requests from this IP, please try again in n hour'
})

app.use('/api',limiter);

// Body parser,reading data from body into req.body
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit: '10kb'}));
app.use(cookieParser())

// Data sanitization against NsSqul query injection 
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp({
    whitelist:['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}))

//test middlewawre
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
})

// app.get('/',(req,res)=>{
//     res.status(200).
//     json({
//         message:'hello form hte server side',
//         app:'natorous'
//     });
// })

// app.post('/',(req,res)=>{
//     res.send('you can post to this endpoint')
// })

// app.get('/api/v1/tours',getAllTours)
// app.post('/api/v1/tours',createTour)
// app.get('/api/v1/tours/:id',getTour)
// app.patch('/api/v1/tours/:id',updateTour);

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings',bookingRouter)


app.all('*',(req,res,next)=>{
    next(new AppError(`cant find ${req.originalUrl} on this server`,400))
});

app.use(globalErrorHandler);

module.exports = app;
