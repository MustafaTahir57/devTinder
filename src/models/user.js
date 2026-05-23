const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,

        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
        default: 21,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female"].includes(value)) {
                throw new Error("Gender invalid!")
            }

        }
    },
    skills: {
        type: [String]
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date
    }

}, { timestamps: true })

userSchema.index({ email: 1 })  // Indexing email in ascending order it will make a copy of this field

userSchema.methods.getJWT = async function () {
    const user = this;
    // Create a JWT Token
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: "7d"
    })

    return token;
}

const User = mongoose.model("User", userSchema)
module.exports = User;