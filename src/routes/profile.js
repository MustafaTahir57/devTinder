const express = require("express")

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation.js")
const User = require("../models/user")

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send("Reading Cookie" + user)
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Update")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated`,
            data: loggedInUser
        })


    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})



module.exports = profileRouter;