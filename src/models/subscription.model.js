import mongoose,{ Schema } from "mongoose";

//schema for subscription

const subscriptionSchema = new Schema({
    subscriber:{ // who is subscribing
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    chennal: { // whom is subscribing
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
