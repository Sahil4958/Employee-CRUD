import { Employee } from "../models/employee.model";
import {
  loginSchema,
  registerSchema,
  resetPasswordLink,
  resetPassword,
  UpatedEmployeeSchema,
} from "../lib/zod";
import { Token } from "../models/tokenSchema";
import { sendEmail } from "../utils/sendEmail";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { apiResponse } from "../utils/apiResponse";
import { messages } from "../utils/messages";
import { handleError } from "../utils/errHandle";

dotenv.config();

export const registerEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = registerSchema.parse(req.body);

    const { email, password, ...rest } = parseResult;
    const existEmployee = await Employee.findOne({ email });

    if (existEmployee) {
      apiResponse(res, StatusCodes.BAD_REQUEST, messages.EXIST_EMPLOYEE);
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await Employee.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    const { password: _password, ...dataWithoutPassword } = employee.toObject();

    if (employee) {
      apiResponse(
        res,
        StatusCodes.CREATED,
        messages.EMPLOYEE_REGISTERED,
        dataWithoutPassword
      );
      return;
    }

    apiResponse(res, StatusCodes.BAD_REQUEST, messages.EMPLOYEE_ERR);
  } catch (error) {
    handleError(res, error);
  }
};

export const loginEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = loginSchema.parse(req.body);

    const { email, password } = parseResult;

    const employee = await Employee.findOne({ email });

    if (!employee) {
      apiResponse(res, StatusCodes.BAD_REQUEST, messages.EMPLOYEE_NOT_EXIST);
      return;
    }

    const comparedPassword = await bcrypt.compare(password, employee.password);

    if (!comparedPassword) {
      apiResponse(res, StatusCodes.BAD_REQUEST, messages.INCORRRECT_PASSWORD);
      return;
    }
    const accessToken = jwt.sign(
      {
        email: employee.email,
      },
      process.env.JWT_SECRETKEY!,
      { expiresIn: "1d" }
    );

    apiResponse(res, StatusCodes.OK, messages.EMPLOYEE_LOGGED, accessToken);
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { sortBy = "employeeName", sortOrder = "ASC",search = ""  } = req.query as {
      sortBy?: string;
      sortOrder?: string;
      search?: string
     
    };

    
// console.log(req.query.search);

    const query: any = {};
   if(search){
    query["$or"] =
    [
      {employeeName: {$regex : search, $options : "i"}},
      {role: {$regex : search, $options : "i"}},
      {address: {$regex : search, $options : "i"}},
      {email: {$regex : search, $options : "i"}},
    ]
    console.log("search",query);
    
   }
  

    const sortOption: Record<string, number> = {};
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;

    console.log(sortOption);

    let employees = await Employee.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ employeeName: -1 }).exec();

    if (!employees || employees.length === 0) {
      apiResponse(res, StatusCodes.NOT_FOUND, messages.EMPLOYEE_NOT_FOUND);
      return;
    }
    const count = await Employee.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    apiResponse(res, StatusCodes.OK, messages.EMPLOYEE_FETCHED, {
      employees,
      count,
      totalPages,
    });
  } catch (error) {
    handleError(res, error);
  }
};


export const getEmployeeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id).select("-password");

    if (!employee) {
      apiResponse(res, StatusCodes.NOT_FOUND, messages.EMPLOYEE_NOT_FOUND);
      return;
    }

    apiResponse(res, StatusCodes.OK, messages.EMPLOYEE_FETCHED, employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    handleError(res, error);
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
      return apiResponse(res, 404, "Employee not found");
    }

    const validatedData = UpatedEmployeeSchema.parse(req.body);

    let updateData = { ...validatedData };
    if (validatedData.password) {
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      updateData.password = hashedPassword;
    }

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    apiResponse(res, 200, "Employee updated successfully", updatedEmployee);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      apiResponse(res, StatusCodes.NOT_FOUND, messages.EMPLOYEE_NOT_FOUND);
      return;
    }

    await Employee.findByIdAndDelete(id);

    apiResponse(res, StatusCodes.OK, messages.EMPLOYEE_DELETED);
  } catch (error) {
    console.error("Error deleting employee:", error);
    handleError(res, error);
  }
};

export const resetPasswordMailLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = resetPasswordLink.parse(req.body);

    const { email } = parseResult;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      apiResponse(res, StatusCodes.NOT_FOUND, messages.EMPLOYEE_NOT_EXIST);
      return;
    }
    let token = await Token.findOne({ employeeId: employee._id });
    if (!token) {
      token = await Token.create({
        employeeId: employee._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      token.save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${employee._id}/${token.token}`;
    await sendEmail(employee.email, "Password reset", link);

    apiResponse(res, StatusCodes.OK, messages.PASSWORD_RESET_LINK, link);
  } catch (error) {
    handleError(res, error);
  }
};

export const resetPasswordForEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employeeId, token } = req.params;
    const parseResult = resetPassword.parse(req.body);

    const { newPassword, confirmPassword } = parseResult;

    if (newPassword !== confirmPassword) {
      apiResponse(res, StatusCodes.BAD_REQUEST, messages.PASSWORD_NOT_MATCHED);
      return;
    }
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      apiResponse(res, StatusCodes.NOT_FOUND, messages.EMPLOYEE_NOT_EXIST);
      return;
    }
    const storedToken = await Token.findOne({
      employeeId: employee._id,
      token,
    });

    if (!storedToken) {
      apiResponse(res, StatusCodes.BAD_REQUEST, messages.EXPIRED_TOKEN_OR_LINK);
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.password = hashedPassword;

    await Employee.findByIdAndUpdate(employeeId, {
      new: true,
      password: hashedPassword,
    });

    await storedToken.deleteOne();
    apiResponse(
      res,
      StatusCodes.ACCEPTED,
      messages.PASSWORD_RESET_SUCCESSFULLY
    );
  } catch (error) {
    handleError(res, error);
  }
};
export const resetGet = async (req: Request, res: Response): Promise<void> => {
  const { employeeId, token } = req.params;
  try {
    const tokenVerify = await Token.findOne({ employeeId, token });
    if (!tokenVerify) {
      apiResponse(res, StatusCodes.BAD_REQUEST, messages.EXPIRED_TOKEN_OR_LINK);
      return;
    }
    res.render("employee", { employeeId, token });
  } catch (error) {
    handleError(res, error);
  }
};
