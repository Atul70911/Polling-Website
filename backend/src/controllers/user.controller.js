import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// ✅ FIXED: Standardized Cookie Options for Cross-Site (Render <-> GitHub Pages)
const cookieOptions = {
    httpOnly: true,
    secure: true,      // Must be true for cross-site
    sameSite: "none"   // REQUIRED for cross-site cookies
};

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefereshToken(); // Keep your exact spelling
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while generating tokens");
    }
}   

const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;
    if ([name, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const existUser = await User.findOne({
        $or: [{ email }]
    })
    if (existUser) {
        throw new ApiError(409, "User Already Exists");
    }

    // ✅ FIXED: Added optional chaining to prevent 500 crash if no file is uploaded
    const avatarLocalPath = req.files?.profilePicture?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }
    const user = await User.create({
        name,
        username,
        email,
        password,
        profilePicture: avatar.secure_url
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "User Not Created");
    }
    
    // ✅ FIXED: Parameter order (statusCode, data, message)
    return res.status(201).json(new ApiResponse(201, createdUser, "User Created Successfully"))
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        throw new ApiError(400, "All fields are required")
    }
    
    // ✅ FIXED: Added .select("+password") so bcrypt can actually compare it!
    const user = await User.findOne({
        $or: [{ email }]
    }).select("+password");
    
    if (!user) { throw new ApiError(404, "User Not Found") }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
    return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            // ✅ FIXED: Parameter order -> (statusCode, dataObject, message)
            new ApiResponse(200, {
                user: createdUser,
                accessToken,
                refreshToken
            }, "User Logged In Successfully")
        )
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User Logged Out"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        // ✅ FIXED: Typo in your function name here (was generateAccessAndRefereshTokens)
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200, 
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    
    // ✅ FIXED: Must select +password here too!
    const user = await User.findById(req.user?._id).select("+password");
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails
};