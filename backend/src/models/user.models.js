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
     
    },

    profilePicture: {
      type: String,
      default: ""
    },
    refreshToken:{
      type : String,
      default: null
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect=async function (password) {
  return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function () {
 return jwt.sign(
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
   return jwt.sign(
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
