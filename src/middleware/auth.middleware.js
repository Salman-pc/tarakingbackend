import { Response } from "express-error-catcher";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config.js";

export const auth = async (req, res, next) => {

    const authHeader = req.headers.authorization;
 
    if(!authHeader){
        return new Response("must be need token",{  success: false },401)
    }

      const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
    });
  }

  try {
   const decoded = jwt.verify(token,JWT_SECRET)
   const { userId, name, email, role } = decoded;

  req.user = { userId, name, email, role };
   console.log(decoded)
   next()
  } catch (error) {
    return new Response("Invalid or expired token", { success: false },401)
    
  }
    
}