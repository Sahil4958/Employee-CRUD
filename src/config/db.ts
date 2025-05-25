import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbConnect = () => {
  mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log("Database has been connected");
  }).catch((err:any)=>{
    console.log(err);
    
  })
};


export default dbConnect