const nodemailer = require('nodemailer');
const consoleLog = require("../Utils/consoleLog")
const mailer =async (SendFrom , SendTo , subject , text)=>{


        const transporter = nodemailer.createTransport({ // details of transporting the email
            service:'gmail',
            port:587, //SMTPS port
            secure:true,
                auth:{
                    user: 'baraamohamed2311@gmail.com',
                    pass: process.env.MAILERPASS
                }
        })
        try {
            const email_info = await transporter.sendMail({
                from: SendFrom,
                to:SendTo,
                replyTo: SendFrom, // to send reply to user that sent the ticket instead of 'baraamohamed2311@gmail.com'
                subject:subject,
                text:text
            })
            return true;
        }
        catch(e){
            consoleLog(`Error catch inside mailSupportHelpers  ${e}`,"error");
            return false;
        }
        
 }

 module.exports = mailer