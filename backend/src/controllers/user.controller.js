import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";

const registerUser= asyncHandler(
    async (req,res)=>{
        const {name,username,email,password}=req.body;
        if ([name,username,email,password].some((field)=>field?.trim()==="")) {
            throw new ApiError(400,"All fields are required");
        }
        const existUser=User.findOne({
            $or:[{email}]
        })
        if(existUser){
            throw new ApiError(409,"User Already Exists");
        }

        res.files?.avatar


    }
)

export {registerUser}