import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const varifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }
    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedtoken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "INVALID ACCESS TOKEN");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "INVALID ACCESS TOKEN");
  }
});
