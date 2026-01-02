import express from "express";
import * as controller from "../controllers/auth.controller.js";

const route = express.Router()

route.post("/register",controller.userRegister)
route.post("/login",controller.userLogin)

export default route;
