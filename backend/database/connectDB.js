const mongoose = require("mongoose");
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PSWD}@spacex.amqlv.mongodb.net/?retryWrites=true&w=majority`
    ).then( () => console.log("DB connection successfull"))
    .catch( (err) => {
        console.log("Database not connected")
    })