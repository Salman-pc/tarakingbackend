import { asyncErrorHandler, Response } from "express-error-catcher";
import models from "../modles/index.js";

export const addUserAddress = asyncErrorHandler(async (req) => {
    let { location } = req.body
    console.log(location,"list location")
    let userId = req?.user?.userId

    if (!location) {
        return new Response("location must be need ", { success: false }, 400)
    }

    const UserLocation = new models.Address({ userId, location })
    await UserLocation.save()

    return new Response("location added successfully", { success: true }, 201)


})

export const getUserAddress = asyncErrorHandler(async (req) => {

    let userId = req?.user?.userId
    console.log("iam workingffffffffn", userId)
    if (!userId) {
        return new Response("please login  ", { success: false }, 400)
    }

    const UserLocation = await models.Address.findOne({ userId })

    return new Response("user location successfully", {
        success: true,
        UserLocation
    }, 200)

})

export const updateUserAddress = asyncErrorHandler(async (req) => {
    let { location, id } = req.body
    let userId = req?.user?.userId

    if (!location) {
        return new Response("location must be need ", { success: false }, 400)
    }

    const UserLocation = await models.Address.findOneAndUpdate({ _id: id }, { userId, location }, { new: true, upsert: true })
    await UserLocation.save()

    return new Response("location added successfully", { success: true }, 201)


})

export const getCustomerAddress = asyncErrorHandler(async (req) => {
    let { userId } = req.query


    if (!userId) {
        return new Response("must be select user  ", { success: false }, 400)
    }

    const UserLocation = await models.Address.findOne({ userId })

    return new Response("user location successfully", {
        success: true,
        UserLocation
    }, 200)

})
