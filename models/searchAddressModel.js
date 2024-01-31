const mongoose = require('mongoose');

const searchAddressSchema = new mongoose.Schema({

    userId:{
        type: String
    },
    heading:{
        type: String
    },
    detail:{
        type: String
    },
    lat:{
        type: String
    },
    long:{
        type: String
    },
    status:{
        type: Number
    }},{
        timestamps: true
});

module.exports = mongoose.model("searchAddress", searchAddressSchema);
