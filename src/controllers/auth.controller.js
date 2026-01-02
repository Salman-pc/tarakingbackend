import { userRegisterValidation } from "../utils/validation.js";
import models from "../modles/index.js"
import { generateToken } from "../utils/generateToken.js";
import { asyncErrorHandler, Response } from "express-error-catcher";

export const userRegister = asyncErrorHandler(async (req) => {

    const { error } = userRegisterValidation.validate(req.body);

    if (error) {
        return new Response(error.details[0].message, { success: false }, 400);
    }

    let { name, email, password,role } = req.body;

    console.log(name, email, password, "req.body");

    const user = await models.Users.findOne({ email: email });

    if (user) {
        return new Response("User already exists", { success: false }, 400);
    }

    const newUser = new models.Users({ name, email, password,role });
    await newUser.save();

    console.log(newUser, "newUsers");

    const { accessToken } = generateToken(newUser);

    return new Response("User registered successfully", { success: true, data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        accessToken
    }}, 201);
})

export const userLogin =asyncErrorHandler(async (req) => {

    const { email, password } = req.body;

    if(!email || !password){
        return new Response("Email and password are required", { success: false }, 400);
    }

    const user = await models.Users.findOne({ email: email });

    if (!user) {
        return new Response("Invalid email or password", { success: false }, 400);
    }
    
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return new Response("Invalid email or password", { success: false }, 400);
    }

    const accessToken = generateToken(user);

    return new Response("User logged in successfully", { success: true, data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken
    }}, 200);
}
)