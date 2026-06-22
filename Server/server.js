// configuring dotenv to access variables
const dev = process.env.NODE_ENV ;

if (dev === 'local') {
  require('dotenv').config({ path: './.env.local' }); 
  console.log("Running in local environment");
} else if(dev === 'production') {
  const result = require('dotenv').config({
    path: '/run/secrets/prod_ems_server_config'
  });   // Load production environment variables
  console.log("Running in production environment" );
}
else if(dev === 'production-kube') {
  require('dotenv').config({ path: './.env.prod.kube' });   // Load production environment variables
  console.log("Running in production-kube environment");
}
else{
  require('dotenv').config({ path: './.env.dev' });  // Load development environment variables
  console.log("Running in development environment");
}
/**************************/
const express = require("express");
const app = express();
const consoleLog = require("./Utils/consoleLog.js");
const appUses = require("./Startup/appUses.js");
const mongoose = require("mongoose")
// environment vars
const PORT = process.env.PORT;


  appUses(express ,app);


  app.get('/', (req, res) => {
    res.send('Welcome To EMS Server')
  })

// Server Launch
app.listen(PORT,async (req, res)=>{
    await mongoose.connect(process.env.EMS_MongoDB);
    console.log("MongoDB ready");
    consoleLog(`Server is Running on port : ${PORT}` , "success"); 
})


