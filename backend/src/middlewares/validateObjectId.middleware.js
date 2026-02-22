import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const validateObjectId = (paramName = "id") => (req, _res, next) => {
  const value = req.params[paramName];
  if (!mongoose.isValidObjectId(value)) {
    throw new ApiError(400, `Invalid ${paramName}`);
  }
  next();
};