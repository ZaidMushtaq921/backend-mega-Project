import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
//TODO: METHOD TO GENERATE ACCESS TOKEN AND REFRESH TOKEN
const generateAcessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken; // it will save in db
    await user.save({ validationBeforeSave: false }); // it will not validate the data before saving
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "INTERNAL SERVER ERROR: TOKEN ARE NOT GENERATED");
  }
};

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
  console.log("user found");
  //TODO: CHECK AVATAR IS RECEIVED OR NOT {handling images}
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "AVATAR IS REQUIRED");
  }
  console.log("file path found");
  //TODO: UPLOAD  FILES ON CLOUDINARY
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("uploaded avatar");
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

const loginUser = asyncHandler(async (req, res) => {
  /*TODO: 
  1. GET USERNAME , EMAIL AND PASSWORD FROM REQUEST BODY
  2. CHECK EMAIL AND PASSWORD IS VALID OR NOT
  3. FIND USER IN DB USING EMAIL
  4. CHECK PASSWORD IS CORRECT OR NOT
  5. GENERATE ACCESS TOKEN AND REFRESH TOKEN
  6. SEND AS COOKIE TO USER
  7. SEND RESPONSE TO USER
  */

  //TODO:  GET USERNAME , EMAIL AND PASSWORD FROM REQUEST BODY
  const { username, email, password } = req.body;

  //TODO: CHECK EMAIL AND PASSWORD IS VALID OR NOT
  if (!(username || email) || !password) {
    throw new ApiError(400, "USERNAME OR EMAIL AND PASSWORD IS REQUIRED");
  }
  //TODO: FIND USER IN DB
  const user = await User.findOne({
    $or: [{ username: username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "USER NOT FOUND...");
  }
  //TODO: CHECK PASSWORD IS CORRECT OR NOT
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "PASSWORD IS NOT CORRECT");
  }
  //TODO: GENERATE ACCESS TOKEN AND REFRESH TOKEN
  const { accessToken, refreshToken } = await generateAcessAndRefreshToken(
    user._id
  );
  //TODO: GET USER WITHOUT PASSWORD AND REFRESH TOKEN
  const userLogedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //TODO: CREATE OPTIONS FOR COOKIE
  const options = {
    httpsOnly: true,
    secure: true,
  };
  //TODO: SEND AS COOKIE TO USER
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: userLogedIn,
          accessToken,
          refreshToken,
        },
        "LOGIN SUCCESSFULLY"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpsOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "LOGOUT SUCCESSFULLY"));
});
const refreshAcessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "UNOTHARIZED REQUEST");
  }
  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedToken) {
      throw new ApiError(401, "UNOTHARIZED REQUEST");
    }
    const user = await User.findById(decodedToken?._id);
    // console.log(user);
    if (!user) {
      throw new ApiError(401, "INVALID REFRESH TOKEN");
    }
    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "REFRESH TOKEN IS EXPIRED OR USED");
    }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateAcessAndRefreshToken(user._id);
    console.log("acesstoken: ", newAccessToken);
    console.log("refreshtoken: ", newRefreshToken);
    const options = {
      httpsOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "ACCESS TOKEN REFRESHED SUCCESSFULLY"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "INVALID REFRESH TOKEN");
  }
});
export { userRegister, loginUser, logoutUser, refreshAcessToken };
