const mongoose = require("mongoose");

const db_uri = process.env.DB_URI;

async function dbConnect() {
    try {
        await mongoose.connect(db_uri);
    } catch (err) {
        throw err;
    }
}

dbConnect()
    .then(() => {console.log("Successfully Connected to Database.")})
    .catch((err) => { console.log("Couldn't connect to Database", err) });