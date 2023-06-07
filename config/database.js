const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const connectMongo = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then((res)=>{console.log('connected')})
    .catch((err)=>{console.log(err);});
}


module.exports = connectMongo;