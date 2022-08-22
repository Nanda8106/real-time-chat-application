const router = require("express").Router();
const User = require("../models/User");

const rooms = ["general", "tech", "finance", "crypto"]

router.get("/rooms", (req, res) => {
    res.json(rooms)
})

module.exports = router