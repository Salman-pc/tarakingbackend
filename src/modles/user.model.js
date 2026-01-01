import { COLLECTIONS } from "../config.js";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

let schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {

            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
              type: String,
            required: true
        },
        location: {
            type: [Number],
            index: '2dsphere'
        }
    },
    {
        timestamps: true,
        collection: COLLECTIONS.USERS
    }
)

schema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error)
    }

})

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

schema.index({ location: '2dsphere' });

const Users = mongoose.model(COLLECTIONS.USERS, schema);

export default Users;