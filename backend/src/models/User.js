import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true //remove extra whitespaces
    },
    email: {
        type: String,
        required: true,
        lowercase: true, //automatically convert all letters into lowercase
        unique: true //would help in creating index
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        trim: true
    }
}, { timestamps: true })

export const UserModel = mongoose.model("User", userSchema)
