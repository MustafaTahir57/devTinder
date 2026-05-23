const express = require("express")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");

const { validateSignUpData } = require("../utils/validation")

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    // Creating a new instance of user model
    validateSignUpData(req.body);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    })

    try {
        await user.save();
        res.send("User Added succesfuly")
    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message)
    }
})

authRouter.post("/signIn", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            res.status(404).send("user Not found")
        }
        const isPasswordvalid = await bcrypt.compare(password, user.password);

        if (isPasswordvalid) {

            // Create a JWT token
            const token = await user.getJWT();

            // Send the cookie back
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.send("Login Success")
        } else {
            throw new Error("Password Invalid")
        }

    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message)
    }

})

authRouter.post("/logout", async (req, res) => {

    // Send the cookie back
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Success")
})

authRouter.post("/forgetPassword", async (req, res) => {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId: emailId })
    if (!user) {
        throw new Error("User not found")
    }
    // will create a test link and send it to the user's email

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    res.cookie("resetToken", resetToken, {
        expires: new Date(Date.now() + 10 * 60 * 1000)
    })

    await user.save();
    // Create reset link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    // TODO: Send email here
    console.log("Reset Link:", resetLink);

    res.json({
        message: "Password reset link sent to email",
    });

})

authRouter.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // find user with valid token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update password
        user.password = hashedPassword;

        // clear reset fields
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.json({
            message: "Password reset successful"
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = authRouter;