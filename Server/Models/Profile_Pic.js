
const mongoose = require('mongoose');


const PIC_Schema = new mongoose.Schema({
  // we store image id of metadata at file collection and binary itself at Employees collection
      file_name:{type:String},
      ImgId:{type:String}
      


},{timestamps:false })


const Profile_PIC_Schema = new mongoose.Schema({
    
    
      
        emp_email: {type:String, required:true},
        emp_pic: PIC_Schema 
      
    
    
},{timestamps:true , collection:"Employees"})

module.exports = mongoose.model("Image",Profile_PIC_Schema);

