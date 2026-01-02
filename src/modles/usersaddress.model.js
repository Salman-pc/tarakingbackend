import mongoose, { Schema } from "mongoose";
import { COLLECTIONS } from "../config.js";

let schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    location: {
        type: [Number],
        required:true
    }
})

schema.index({ location: '2dsphere' });

const Address = mongoose.model(COLLECTIONS.USER_ADDRESS, schema)
export default Address