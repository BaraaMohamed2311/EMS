const mongoose = require("mongoose");
function connect_mongo_bucket(db , bucketName) {
    try{
        const bucket  = new mongoose.mongo.GridFSBucket(db , {bucketName:bucketName})
        console.log("Connected to mongo bucket" , bucketName)
        return bucket;
    }
    catch(err){
        console.log("Error Connection to mongo bucket",err)
    }
   
   
}

module.exports = connect_mongo_bucket;
