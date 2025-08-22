// configuring dotenv to access variables
const dev = process.env.NODE_ENV ;

if (dev === 'local') {
  console.log("Config Local Docker host")
  require('dotenv').config({ path: './.env.local' }); 
} else if(dev === 'prod') {
  require('dotenv').config({ path: './.env.prod' });   // Load production environment variables
}
else{
  console.log("Config development | No containers")
  require('dotenv').config({ path: './.env.dev' });  // Load development environment variables
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


