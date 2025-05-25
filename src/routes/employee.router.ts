import express from 'express';
import { loginEmployee, registerEmployee,getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } from '../controllers/employee.controller';
import authMiddleware from '../middleware/employee.middleware';


const employeeRouter = express.Router();

employeeRouter.post("/register", registerEmployee);
employeeRouter.post("/login",loginEmployee);
employeeRouter.get("/employees",getAllEmployees)
employeeRouter.get("/:id",getEmployeeById);
employeeRouter.patch("/update/:id",authMiddleware,updateEmployee);
employeeRouter.delete("/delete/:id",authMiddleware,deleteEmployee)


export default employeeRouter;