import express from "express";
import Auth from "./auth.route.js";

const mainroute =express.Router()

mainroute.use('/auth',Auth)

export default mainroute