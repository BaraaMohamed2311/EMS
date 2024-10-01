const mongoose = require("mongoose");
 async function connect_mongodb(url) {

    // Connect to MongoDB and return promise

    try{
        await mongoose.connect(url);
        console.log("Connected to MongoDB server using Mongoose");
        return mongoose.connection.db; // to use it to connect to bucket
        
    }
    catch(err){
        console.log("Error connection to DB")
    }
  
}

module.exports = connect_mongodb;
