const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({

    address:{
        type: String
    },
    country:{
        type: String
    },
    state:{
        type: String
    },
    city:{
        type: String
    },
    pincode:{
        type: Number
    },
    latitude:{
        type: String
    },
    longitude:{
        type: String
    },
    landmark:{
        type: String
    },
    status:{
        type: Number
    },
    updatedBy:{
        type: String
    }},{
        timestamps: true
});

module.exports = mongoose.model("Address", addressSchema);