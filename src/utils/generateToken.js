import { JWT_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export const generateToken = (user)=>{
    const accessToken = jwt.sign(
        {
            userId:user._id,
            email:user.email,
            name:user.name,
            role:user.role
        },
       JWT_SECRET,
        {expiresIn:"1d"}
    );
    return accessToken;
}