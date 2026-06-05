const express = require("express");
require("./config/database")
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser());

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


connectDB().then(() => {
    app.listen(7777, () => {
    });
}).catch((err) => {
    console.error("Connection Failed", err)
})