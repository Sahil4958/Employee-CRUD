import { Document, Schema, model} from "mongoose";

export interface Employee {
  employeeName: string;
  age: number;
  role: string;
  address: string;
  email: string;
  password: string;
}

export interface EmployeeDocument extends Employee, Document {}


const employeeSchema = new Schema<EmployeeDocument>({
  employeeName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  role: {
    type: String,
    required: false,
    default : "Software Developer",
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value: string) {
    
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: (props: any) => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [5, 'Password must be at least 5 characters long']
  }
});

// Export the model
export const Employee = model<EmployeeDocument>("Employee", employeeSchema);
