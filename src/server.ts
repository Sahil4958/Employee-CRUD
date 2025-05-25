import express from 'express';
import dotenv from 'dotenv'
import dbConnect from './config/db';
import employeeRouter from './routes/employee.router';

dotenv.config();

const app = express()
dbConnect()
const PORT = process.env.PORT;

app.use(express.json());

app.use("/employee",employeeRouter)


app.listen(PORT,():void=>{
    console.log(`Your server has been running at http://localhost:${PORT}`);
    console.log(process.env.TEST);
    
})






