const mongoose = require('mongoose');

const valetDetail = new mongoose.Schema({

    userId:{
        type: String
    },
    address:{
        type: String
    },
    latitude:{
        type: String
    },
    longitude:{
        type: String
    },
    currentStatus:{
        type: Number
    },
    updatedBy:{
        type: String
    }},{
        timestamps: true
});

module.exports = mongoose.model("valetDetail", valetDetail);