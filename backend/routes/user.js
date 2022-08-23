const router = require("express").Router();
const User = require("../models/User");

router.post("/signup", async(req, res) => {
    try{
        const {name, email, password, picture} = req.body;
        const user = await User.create({name, email, password, picture})
        res.status(201).json(user);

    }catch(error){
        let message;
        if(error.code == 11000){
            message = "User already exist!"
        }else{
            message = error.message;
        }
        res.status(400).json(message)
    }
})

router.post("/signin", async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findByCredentials(email, password);
        user.status = 'online';
        await user.save();
        res.status(200).json(user);
    }catch(error){
        res.status(400).json(error.message)
    }
})

module.exports = router;