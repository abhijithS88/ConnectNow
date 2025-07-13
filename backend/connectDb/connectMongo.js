const mongoose = require('mongoose');
const uri = process.env.Mongo_uri


const connection = async () =>{
    try{
        await mongoose.connect(uri);
        console.log("mongodb connected");
    }catch(err){
        console.log("mongodb connection failer" + err.message);
    }
}

module.exports = connection;