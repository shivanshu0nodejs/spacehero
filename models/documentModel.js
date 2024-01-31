const mongoose = require('mongoose');

const documentCoupon = new mongoose.Schema({

    userId:{
        type: String
    },
    drivingLicense:{
        type: String
    },
    licenseStatus:{
        type: Number
    },
    aadharCard:{
        type: String
    },
    aadharStatus:{
        type: Number
    },
    panCard:{
        type: String
    },
    panStatus:{
        type: Number
    },
    statusMessage:{
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

module.exports = mongoose.model("document", documentCoupon);