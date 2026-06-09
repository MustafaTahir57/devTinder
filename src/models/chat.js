const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        participants: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            required: true,
            validate: (v) => v.length === 2,
        },

        lastMessage: {
            text: String,
            sender: mongoose.Schema.Types.ObjectId,
            sentAt: Date,
            type: {
                type: String,
                enum: ["text", "image", "file"],
                default: "text",
            },
        },

        lastReadAt: {
            type: Map,
            of: Date,
            default: {},
        },
    },
    { timestamps: true }
);

chatSchema.index({ participants: 1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;