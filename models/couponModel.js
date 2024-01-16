const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({

    heading:{
        type: String
    },
    detail:{
        type: String
    },
    type:{
        type: String
    },
    discount:{
        type: Number
    },
    discountPercentage:{
        type: Number
    },
    startDate:{
        type: String
    },
    endDate:{
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

module.exports = mongoose.model("coupon", couponSchema);