
const mongoose = require('mongoose');


const PIC_Schema = new mongoose.Schema({
  // we store image id of metadata at file collection and binary itself at Employees collection
      file_name:{type:String},
      ImgId:{type:String}
      


},{timestamps:false })


const Profile_PIC_Schema = new mongoose.Schema({
    
    
        user_id: {type:String, required:true},
        user_pic: PIC_Schema 
      
    
    
},{timestamps:true , collection:"EMS_Images"})

module.exports = mongoose.model("Image",Profile_PIC_Schema);

