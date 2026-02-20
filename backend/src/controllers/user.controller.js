import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefereshToken();
        user.refreshTokens=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating tokens");
    }
}   

const registerUser= asyncHandler(
    async (req,res)=>{
        const {name,username,email,password}=req.body;
        if ([name,username,email,password].some((field)=>field?.trim()==="")) {
            throw new ApiError(400,"All fields are required");
        }
        const existUser=await User.findOne({
            $or:[{email}]
        })
        if(existUser){
            throw new ApiError(409,"User Already Exists");
        }

        const avatarLocalPath=req.files?.profilePicture[0]?.path;
        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar is required");
        }
        const avatar=await uploadOnCloudinary(avatarLocalPath);

        if(!avatar){
            throw new ApiError(400,"Avatar is required");
        }
        const user=await User.create({
            name,
            username,
            email,
            password,
            profilePicture: avatar.secure_url
        })
        const createdUser=await User.findById(user._id).select("-password -refreshTokens");
        if(!createdUser){
            throw new ApiError(500,"User Not Created");
        }
        return res.status(201).json(new ApiResponse(201,"User Created Successfully",createdUser))
    }
)

const loginUser= asyncHandler(async(req,res)=>{
    
    //check username/email
    //find the user
    //password.check
    //access and referesh token
    //send cookie

    const {email,password}=req.body;
    if(!email){
        throw new ApiError(400,"All fields are required")
    }
    const user=await User.findOne({
        $or:[{email}]
    })
    
    if(!user){throw new ApiError(404,"User Not Found")}

    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Password")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

    const options={
        httpOnly:true,
        secure:true
    }
    const createdUser=await User.findById(user._id).select("-password -refreshTokens");
    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,"User Logged In Successfully",{
            user:createdUser,
            accessToken,
            refreshToken
        })
    )

   


})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
     const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out"))
})

export {registerUser,loginUser,logoutUser}