import { DATABASE_URL } from "../config.js"
import mongoose from "mongoose";

const connectDb= async()=>{ 

    try {
        await mongoose.connect(DATABASE_URL)
        console.log("Database connected successfully")
    } catch (error) {
        console.error("Database connection error:", error)
    }
}
export default connectDb;