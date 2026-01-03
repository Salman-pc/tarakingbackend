
import * as Addrescontroller from '../controllers/address.controller.js'
import { auth } from '../middleware/auth.middleware.js'
import express from 'express'

const route=express.Router()
route.use(auth)

route.post('/add',Addrescontroller.addUserAddress)
route.get('/list',Addrescontroller.getUserAddress)
route.put('/update',Addrescontroller.updateUserAddress)
route.get('/customer-location',Addrescontroller.getCustomerAddress)

export default route