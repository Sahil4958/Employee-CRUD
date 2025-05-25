
import { Employee } from "../models/employee.model";
import { loginSchema, registerSchema, updateEmployeeSchema,resetPasswordlinkSchema } from "../lib/zod";
import { Token } from "../models/tokenSchema";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

//Register an employeee

export const registerEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const parseResult = registerSchema.parse(req.body);

    if(!parseResult){
      res.status(400).json({success:false,message:"validation error"})
     return
    }
     const { employeeName, age, role, address, email, password } = parseResult
    const existEmployee = await Employee.findOne({ email });

    if (existEmployee) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "This employee is already exist please login it",
      });
      return
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await Employee.create({
      employeeName,
      age,
      role,
      address,
      email,
      password: hashedPassword,
    });

    if (employee) {
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Employee has been registerd successfully",
        employee: {
          employeeName: employee.employeeName,
          age: employee.age,
          role: employee.role,
          address: employee.address,
          email: employee.email,
        },
      });
    }

    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Failed to create employee for unknown reason",
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Internal server error" });
  }
};

//login employee

export const loginEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
      const parseResult = loginSchema.parse(req.body);

    if(!parseResult){
      res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"validation error"})
     return
    }
     const { email, password } = parseResult

    const employee = await Employee.findOne({ email });

    if (!employee) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `User is not exist please register it`,
      });
      return;
    }

    const comparedPassword = await bcrypt.compare(password, employee.password);

    if (!comparedPassword) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({
          sucsess: false,
          message: "Password is not matched pls login again",
        });
      return;
    }
    const accessToken = jwt.sign(
      {
        email: employee.email,
      },
      process.env.JWT_SECRETKEY!,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged Sucessfully",
      accessToken,
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//get all employee

export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employees = await Employee.find().select("-password");

    if (!employees || employees.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No employees found.",
      });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employees fetched successfully.",
      employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while fetching employees.",
    });
  }
};

//get employee by id

export const getEmployeeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id).select("-password");

    if (!employee) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Employee not found.",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee fetched successfully.",
      employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while fetching the employee.",
    });
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      res.status(StatusCodes.OK).json({ success: false, message: "Employee not found" });
    }

   const parseResult = updateEmployeeSchema.parse(req.body);

    if(!parseResult){
      res.status(400).json({success:false,message:"validation error"})
     return
    }
     const data = parseResult

    const updatedData: any = {};

    if (data.employeeName) updatedData.employeeName = data.employeeName;
    if(data.age)updatedData.age = data.age;
    if(data.email)updatedData.email = data.email
    if (data.role) updatedData.role = data.role;
    if (data.address) updatedData.address = data.address;
    if (data.password) updatedData.password = await bcrypt.hash(data.password, 10);

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).select("-password");

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
  }
};


//delete an employee

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Employee not found" });
      return;
    }

    await Employee.findByIdAndDelete(id);

    res.status(StatusCodes.NO_CONTENT).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
  }
};


//restet password link

export const resetPasswordlink = async(req:Request,res:Response)=>{
const parseResult = resetPasswordlinkSchema.parse(req.body);
if(!parseResult){
  res.status(400).json({success:false,message:"validation error"})
 return
}

const { email } = parseResult;

const employee = await Employee.findOne({ email})

if(!employee){
  res.status(StatusCodes.NOT_FOUND).json({success:false,message:"Employee not found"})
  return
}
const token = jwt.sign({email:employee.email},process.env.JWT_SECRETKEY!,{expiresIn:"1d"});

 await Token.create({employeeId: employee._id,token})
 

}