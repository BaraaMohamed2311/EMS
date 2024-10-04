// configuring dotenv to access variables
const dev = process.env.NODE_ENV ;

if (dev === 'development') {
  require('dotenv').config({ path: './.env.development' });  // Load development environment variables
} else if(dev === 'production') {
  require('dotenv').config({ path: './.env.production' });   // Load production environment variables
}
else{
  require('dotenv').config({ path: './.env.local' }); 
}
/**************************/
const express = require("express");
const app = express();
const consoleLog = require("./Utils/consoleLog.js");
const appUses = require("./Startup/appUses.js")
// environment vars
const PORT = process.env.PORT;


  appUses(express ,app);


  app.get('/', (req, res) => {
    res.send('Welcome To EMS Server')
  })

// Server Launch
app.listen(PORT,(req, res)=>{
    res
    consoleLog(`Server is Running on port : ${PORT}` , "success"); 
})


