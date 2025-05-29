import express from 'express';
import dotenv from 'dotenv'
import dbConnect from './config/db';
import employeeRouter from './routes/employee.router';
import bodyParser from 'body-parser'
import  {setupSwagger}  from './utils/swagger';

dotenv.config();

const app = express()
dbConnect()
const PORT = process.env.PORT;

app.use(express.json());

app.set("view engine","ejs");
app.set("views", __dirname + "/views")

app.use(bodyParser.urlencoded({extended:false}))
 
app.use("/employee",employeeRouter)


app.listen(PORT,():void=>{
    console.log(`Your server has been running at http://localhost:${PORT}`);
    setupSwagger(app,PORT)
})








