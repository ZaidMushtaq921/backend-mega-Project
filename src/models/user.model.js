// Import necessary modules
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the user schema
const userSchema = new Schema(
  {
    // Username field with required, unique, lowercase, trim, and index properties
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Email field with required, unique, lowercase, and trim properties
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Fullname field with required and trim properties
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Avatar field with required property
    avatar: {
      type: String, // Cloudinary URL
      required: true,
    },

    // Cover image field
    coverImage: {
      type: String, // Cloudinary URL
    },

    // Watch history field with an array of Video object IDs
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    // Password field with required property
    password: {
      type: String,
      required: [true, "password is required "],
    },

    // Refresh token field
    refreshToken: {
      type: String,
    },
  },
  {
    // Add timestamps to the schema
    timestamps: true,
  }
);

// Pre-save middleware to hash the password before saving
userSchema.pre("save", function (next) {
  // Check if the password is modified
  if (!this.isModified("password")) return next();

  // Hash the password and store it in the password field
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// Method to compare the provided password with the hashed password
userSchema.methods.isPasswordChanged = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Export the User model
const User = mongoose.model("User", userSchema);