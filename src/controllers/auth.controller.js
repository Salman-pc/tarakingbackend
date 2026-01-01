import { userRegisterValidation } from "../utils/validation.js";
import modals from "../modles/index.js"
import { generateToken } from "../utils/generateToken.js";
import { asyncErrorHandler, Response } from "express-error-catcher";

export const userRegister = asyncErrorHandler(async (req) => {

    const { error } = userRegisterValidation.validate(req.body);

    if (error) {
        return new Response(error.details[0].message, { status: 400 }, { success: false });
    }

    let { name, email, password } = req.body;

    const user = await modals.Users.findOne({ email });

    if (user) {
        return new Response("User already exists", { status: 400, success: false });
    }

    const newUser = new models.Users({ name, email, password });
    await newUser.save();

    const { accessToken } = generateToken(newUser);

    return new Response("User registered successfully", { status: 201, success: true ,data:{
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        accessToken
    }});
})