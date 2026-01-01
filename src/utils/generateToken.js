import { JWT_SECRET } from "../config.js";

export const generateToken = (user)=>{
    const accessToken = jwt.sign(
        {
            userId:user._id,
            email:user.email,
            name:user.name
        },
       JWT_SECRET,
        {expiresIn:"1d"}
    );
    return accessToken;
}