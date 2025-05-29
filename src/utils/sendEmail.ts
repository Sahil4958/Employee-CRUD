import nodemailer from  'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

export const sendEmail = async(email:string,subject:string,text:string)=>{
try{
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service : process.env.SERVICE,
    secure :true,
    auth : {
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
})

await transporter.sendMail({
    from : process.env.EMAIL,
    to : email,
    subject : subject,
    text : text
})

console.log("Email sent successfully");

}catch(error){
    console.error("Error fetching employees:", error);
       
}
}