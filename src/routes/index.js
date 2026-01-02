import express from "express";
import Auth from "./auth.route.js";
import address from "./address.route.js"

const mainroute = express.Router()

mainroute.use('/auth', Auth)
mainroute.use('/address', address)


export default mainroute