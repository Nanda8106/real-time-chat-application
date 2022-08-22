const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {  isEmail } = require("validator");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name can't be blank"]
    },
    email: {
        type: String,
        required: [true, "Email can't be blank"],
        lowercase: true,
        unique: true,
        index: true,
        validate: [isEmail, "Email Invalid"]
    },
    password: {
        type: String,
        required: [true, "Password can't be blank"]
    },
    picture: {
        type: String,
    },
    newMessages: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        default: "online"
    }
}, {minimize: false});

UserSchema.pre("save", function(next){
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);
        
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) return next(err);

            user.password = hash;
            next();
        })
    })
})

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    // delete userObject._id;
    delete userObject.__v;
    return userObject;
}
UserSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email});
    if(!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Invalid Credentials');
    return user
}
const User = mongoose.model("User", UserSchema);
module.exports = User;