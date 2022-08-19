const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
require("./database/connectDB");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// my routes
const userRoutes = require("./routes/user");


const httpServer = require('http').createServer(app);
const PORT = 4000;
const io = require("socket.io")(httpServer, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }   
});

app.use("/api/v1", userRoutes)


httpServer.listen( PORT, () => {
    console.log("Listening to port", PORT)
})
