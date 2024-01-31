const mongoose = require('mongoose');

const myCarSchema = new mongoose.Schema({

    userId:{
        type: String
    },
    regNo:{
        type: String
    },
    fuelType:{
        type: String
    },
    transmission:{
        type: String
    },
    carName:{
        type: String
    }},{
        timestamps: true
});

module.exports = mongoose.model("myCar", myCarSchema);
