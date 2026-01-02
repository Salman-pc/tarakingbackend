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
        role: {
            type: String,
            enum: ["customer", "provider"],
            default: "customer"
        }
        
    },
    {
        timestamps: true,
        collection: COLLECTIONS.USERS
    }
)

schema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

schema.index({ location: '2dsphere' });

const Users = mongoose.model(COLLECTIONS.USERS, schema);

export default Users;