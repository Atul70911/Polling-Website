import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false // so password hash doesn't come back in queries by default
    },

    profilePicture: {
      type: String,
      default: ""
    },
    refreshTokens:{
      type : String,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save",async function (next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect=async function (password) {
  return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function () {
  jwt.sign(
    {
    _id:this._id,
    email:this.email,
    username:this.username,
    name:this.name,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  )
}
userSchema.methods.generateRefereshToken=function () {
  jwt.sign(
    {
    _id:this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  }
  )
}

export const User = mongoose.model("User", userSchema);
