import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the video schema with required fields and their data types
const videoSchema = new Schema(
  {
    // Cloudinary URL for the video file
    videoFile: {
      type: String,
      required: true,
    },
    // Cloudinary URL for the video thumbnail
    thumbnail: {
      type: String,
      required: true,
    },
    // Title of the video
    title: {
      type: String,
      required: true,
    },
    // Description of the video
    description: {
      type: String,
      required: true,
    },
    // Number of views for the video
    views: {
      type: Number,
      default: 0,
    },
    // Boolean indicating whether the video is published or not
    isPublished: {
      type: Boolean,
      default: true,
    },
    // ObjectId of the user who owns the video
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Add the mongoose-aggregate-paginate-v2 plugin to the video schema
videoSchema.plugin(mongooseAggregatePaginate);

// Export the Vedio model using the videoSchema
export const Vedio = mongoose.model("Vedio", videoSchema);