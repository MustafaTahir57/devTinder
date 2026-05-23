const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionModel = require("../models/connectionRequest")
const User = require("../models/user")

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const connectionAlreadyExist = await ConnectionModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });

        if (connectionAlreadyExist) {
            return res.status(409).json({ message: "Connection already exists" });
        }

        const newConnection = new ConnectionModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await newConnection.save();

        return res.status(201).json({
            message: "Connection request sent",
            data
        });

    } catch (err) {
        return res.status(500).send("ERROR: " + err.message);
    }
});

requestRouter.post("/request/receive/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"]

        if (!allowedStatus.includes(status)) {
            res.status(404).send("Status not allowed")
        }

        const connectionRequest = await ConnectionModel.findOne({
            toUserId: loggedInUser._id,
            _id: requestId,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).send("Request not found")
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.status(200).send({
            message: `${status} successfully`,
            data: data
        })

    } catch (err) {
        return res.status(500).send("ERROR: " + err.message);
    }

})

module.exports = requestRouter;