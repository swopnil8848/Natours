const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError');
const APIFeatures = require('./../utils/APIFeatures')
const { Model } = require('mongoose');

exports.deleteOne = Model => catchAsync( async (req,res,next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError('no doc found with that id',404))
    }

    res.status(204).json({
        status:'sucess',
        data:null
    });
})

exports.updateOne = Model =>catchAsync(async (req,res,next)=>{
    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    if(!doc){
        return next(new AppError('no document found with that id',404))
    }

    res.status(200).json({
        status:'success',
        data:{
            data:doc
        }
    });
})

exports.createOne = Model => catchAsync(async (req,res,next)=>{
    const doc = await Model.create(req.body);

    res.status(201).json({
        status:'sucess',
        data:{doc}
    })
})

exports.getOne = (Model,popOptions)=>exports.getTour = catchAsync(async (req,res,next)=>{
    let query =  Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    const doc = await query;

    if(!doc){
        return next(new AppError('no document found with that id',404))
    } 
    // console.log('this one is also being called')
    res.status(200).json({
        status:'sucess',
        data:{
            doc
        }
    })
})

exports.getAll = Model => catchAsync(async (req,res)=>{
    let filter = {};
    // this one comes form router.use('/:tourId/reviews',reviewRouter); from tourRoutes.js
    if(req.params.tourId) filter = {tour:req.params.tourId}

    const features = new APIFeatures(Model.find(filter),req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();

    const doc = await features.query;

    //send response
    res.status(200).json({
        status:'sucess',
        results:doc.length,
        data:{
            data:doc
        }   
    })
 }
)


