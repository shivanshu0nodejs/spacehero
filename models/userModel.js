const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userId:{
        type: String
    },
    phone:{
        type: Number,
        required: [true, "Please Enter Number"]
    },
    userName:{
        type: String
    },
    doc_num:{
        type: Number
    },
    name:{
        type: String
    },
    email:{
        type: String
    },
    userImage: {
        type: String
    },
    referral: {
        type: String
    },
    otp:{
        type: String
    },    
    status:{
        type: Number
    },
    role:{
        type: Number
    },
    gender:{
        type: String
    },
    tokens:{
        type: String
    },
    isDeleted:{
        type: Number
    }},{
        timestamps: true
});

module.exports = mongoose.model("User", userSchema);