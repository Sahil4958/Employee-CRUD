
import { Date, Document, Schema, model} from "mongoose";


export interface Token {
    employeeId : String,
    token : String,
    createdAt : Date
}

export interface TokenDocument extends Token, Document {}

const tokenSchema = new Schema({
    employeeId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Employee"
    },

token : {
    type : String,
    required : true
},

createdAt : {
    type: Date,
    default : Date.now,
    expires: '1d'
}
})


export const Token = model<TokenDocument>("Token",tokenSchema );