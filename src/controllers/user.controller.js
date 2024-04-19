import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const userRegister = asyncHandler(async (req, res) => {
  /* TODO: 
 1. GET USER DETAILS FROM FRONTEND (POSTMAN)
 2. VALIDATION OF USER DETAILS
 3. CHECK IF USER ALREADY EXISTS IN DB USING EMAIL AND USERNAME
 4. CHECK AVATAR IS RECEIVED OR NOT
 5. UPLOAD  USER OBJECT ON CLOUDINARY 
 6. IF USER DOES NOT EXIST THEN CREATE USER IN DB USING USER OBJECT 
 7.CHECK USER CREATED SUCESSFULLY OR NOT
 8. REMOVE PASSWORD AND REFRESH TOKEN FROM USER OBJECT BEFORE SENDING TO CLIENT [RESPONSE GOT FORM MONGODB ON REGISTRATION]
 9. SEND USER OBJECT TO CLIENT
 */

  // TODO: GET USER DETAILS FROM FRONTEND (POSTMAN)
  const { email, fullname, password, username } = req.body;
  console.log("email:- ", email);

  // TODO: VALIDATION OF USER DETAILS
  if (
    [email, fullname, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "ALL FIELDS ARE REQUIRED");
  }

  //TODO: CHECK IF USER ALREADY EXISTS IN DB USING EMAIL AND USERNAME
  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (userExists) {
    throw new ApiError(409, "USER EMAIL OR USERNAME ALREADY EXISTS");
  }

  //TODO: CHECK AVATAR IS RECEIVED OR NOT {handling images}
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "AVATAR IS REQUIRED");
  }

  //TODO: UPLOAD  FILES ON CLOUDINARY
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "AVATAR UPLOAD FAILED");
  }

  //TODO: IF USER DOES NOT EXIST THEN CREATE USER IN DB USING USER OBJECT
  const user = await User.create({
    email,
    username: username.toLowerCase(),
    fullname,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  //TODO: CHECK USER CREATED SUCESSFULLY OR NOT
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "USER CREATION FAILED IN DATABASE");
  }

  //TODO: SEND RESPONSE TO USER
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user created sucessfully"));
});
export { userRegister };
