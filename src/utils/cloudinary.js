// Import the necessary modules
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// import { unlink } from "fs/promises";

// Configure cloudinary with the necessary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 *  - The local file path of the file to be uploaded
 * The result object containing the uploaded file's URL
 */
const uploadOnCloudinary = (localFilePath) => {
  try {
    // Return null if the localFilePath is not provided
    if(!localFilePath)return null

    // Upload the file to Cloudinary
    const result = cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Log the success message and the uploaded file's URL
    console.log("file uploaded sucessfully and url is ", result.url);

    // Return the result object
    return result;
  } catch (error) {
    // Log the error message
    console.log("error in uploading file to cloudinary", error);

    // Delete the local file
    fs.unlinkSync(localFilePath);

    // Return null
    return null;
  }
};

// Export the uploadOnCloudinary function
export {uploadOnCloudinary}