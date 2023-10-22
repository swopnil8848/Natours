const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'});

const DB = process.env.DATABASE

mongoose.connect(DB,{
// mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true

}).then(()=>console.log("DB connection sucessfull"))

// mongoose.connect('mongodb+srv://swopnil:Maharj@n123@cluster0.g1k1pxw.mongodb.net/e',{
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:false,
//     useUnifiedTopology: true
// }
// ).then(()=>console.log("DB connection sucessfull"))

const app = require('./app');

// console.log(process.env)

const port =process.env.port || 3000;

app.listen(port,()=>{
    console.log(`app running on port ${port}....`)
});