import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const VerifyJWT = asyncHandler(async(req, res, next) => {
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
 
     if(!token) {
         throw new ApiError(401, "Unauthorised: No token provided");
     }
 
     // Verify the token
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     
     // ✅ FIXED: Use findById instead of findOne
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
 
     if(!user) {
         throw new ApiError(401, "Invalid Token: User not found");
     }
     
     req.user = user;
     next();
     
   } catch (error) {
        // ✅ PRO TIP: Log the actual error so you can see if the DB crashes or if the JWT is actually expired!
        console.error("JWT Verification Error:", error.message);
        throw new ApiError(401, error?.message || "Invalid Token");
   }
});