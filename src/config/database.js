// write the logic to connect ot db

const mongose = require("mongoose")
const dns = require("dns")

dns.setServers(["1.1.1.1", "8.8.8.8"])

const connectDB = async () => {
    await mongose.connect("mongodb+srv://mustafatahir802_db_user:Mustafa1006@learnmongodb.roqdu2r.mongodb.net/devTinder")
}

module.exports = connectDB;
