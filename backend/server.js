const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
require("./database/connectDB");



app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// my routes
const userRoutes = require("./routes/user");
const roomRoutes = require("./routes/room");

// Models
const Message = require("./models/Message")
const User = require("./models/User");


const httpServer = require('http').createServer(app);
const PORT = 4000;
const io = require("socket.io")(httpServer, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE"]
    }   
});


// socket code
async function getLastMessagesFromRoom(room){
    let roomMessages = await Message.aggregate([
        {$match: {to: room}},
        {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
    ])

    return roomMessages;
}

function sortMessagesByDate(messages){
    return messages.sort( function(a, b){
        let date1 = a._id.split("/");
        let date2 = b._id.split("/");

        date1 = date1[2] + date1[0] + date1[1]
        date2 = date2[2] + date2[0] + date2[1]

        return date1 < date2 ? -1 : 1
    })
}

io.on("connection", (socket)=> {
    socket.on("new-user", async() => {
        const members = await User.find();
        io.emit("new-user", members)
    })
    socket.on("join-room", async(room) => {
        socket.join(room)
        let roomMessages = await getLastMessagesFromRoom(room);
        roomMessages = sortMessagesByDate(roomMessages)
        socket.emit('room-messages', roomMessages)
    })

    socket.on("message-room", async(room, content, sender, time, date ) => {
        const newMessage = await Message.create({content, from: sender, to: room, time, date})
        let roomMessages = await getLastMessagesFromRoom(room);
        roomMessages = sortMessagesByDate(roomMessages);

        // sending message to the room
        io.to(room).emit("room-messages", roomMessages);

        socket.broadcast.emit("notifications", room)
    })
})


// routes api
app.use("/api/v1", userRoutes)
app.use("/api/v1", roomRoutes)


httpServer.listen( PORT, () => {
    console.log("Listening to port", PORT)
})
