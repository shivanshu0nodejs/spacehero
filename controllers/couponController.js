const Coupon = require('../models/couponModel.js');
const logs = require("./logger.js");


const addCoupon = async(req, res) => {

    try{

        const {userId, heading, detail, type, discount, discountPercentage, startDate, endDate, status} = req.body;

        if(userId != "" && userId != undefined && heading != "" && heading != undefined && detail != "" && detail != undefined && type != "" && type != undefined && discount != undefined && discount != "" && startDate != undefined && startDate != "" && endDate != undefined && endDate != "" && status != undefined && status != "" && discountPercentage != undefined){

            var usr = req.body.getUser;

            if(usr.role == 1){

                var Data = new Coupon ({

                    heading: heading,
                    detail: detail,
                    type: type,
                    discount: discount,
                    discountPercentage: discountPercentage,
                    startDate: startDate,
                    endDate: endDate,
                    status: status,
                    updatedBy: userId

                })
    
                await Data.save();
    
                res.send({

                    Status: true,
                    Message: "Coupon added successfully",
                    Data: {
    
                        heading: heading,
                        detail: detail,
                        type: type,
                        discount: discount,
                        discountPercentage: discountPercentage,
                        startDate: startDate,
                        endDate: endDate,
                        status: status,
                        AddedBy: userId

                    }
                })
    
                logs.newLog.log('info', "Coupon added successfully");

            }else{

                res.send({
                    Status: false,
                    Message: "Unauthorized to access"

                })
    
                logs.newLog.log('info', "Unauthorized to access");

            }

        }else{

            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e){

        console.log(e);

    }
}


const editCoupon = async (req, res)=> {

    try{

        const {userId, couponId, heading, detail, type, discount, discountPercentage, startDate, endDate, status} = req.body;

        if(userId != "" && userId != undefined && couponId != "" && couponId != undefined && heading != "" && heading != undefined && detail != "" && detail != undefined && type != "" && type != undefined && discount != undefined && discount != "" && startDate != undefined && startDate != "" && endDate != undefined && endDate != "" && status != undefined && discountPercentage != undefined){
               
            var usr = req.body.getUser;

            if(usr.role == 1){

                const cpn = await Coupon.findOne({_id: couponId});

                if(cpn != null){

                    var Data = ({
    
                        heading: heading,
                        detail: detail,
                        type: type,
                        discount: discount,
                        discountPercentage: discountPercentage,
                        startDate: startDate,
                        endDate: endDate,
                        status: status,
                        AddedBy: userId

                    })

                    const updateStatus = await Coupon.updateOne({ _id: couponId }, {$set: Data });
    
                    if(updateStatus.modifiedCount == 1){
            
                        res.send({
                            
                            Status: true,
                            Message: "Coupon edited successfully",
                            Data
                            
                        })

                        logs.newLog.log('info', "Coupon edited successfully");
        
                    }else{
                        
                        res.send({
                            Status: true,
                            Message: "Failed to updated blog",
                            Data
                        })
        
                        logs.newLog.log('info', "Failed to updated blog");

                    }

                }else{
            
                    res.send({
                        Status: false,
                        Message: "Coupon not found"
                    })

                    logs.newLog.log('info', "Coupon not found");

                }

            }else{
                    
                res.send({
                    Status: false,
                    Message: "Unauthorized to access"
                })

                logs.newLog.log('info', "Unauthorized to access");

            }

        }else{
                        
            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }


    }catch(e){

        console.log(e);

    }

}

const couponList = async (req, res) => {

    try{

        const {userId} = req.body;

        if(userId != undefined && userId != ""){

            var usr = req.body.getUser;

            if(usr.role == 1){

                var info = await Coupon.find().sort({_id: -1});

            }else if(usr.role != 1){

                var info = await Coupon.find({status: 1}).sort({_id: -1});
                
            }
    
            var Data = await Promise.all(info.map(async (num) => {

                return {

                    _id: num._id,
                    heading: num.heading,
                    detail: num.detail,
                    type: num.type,
                    discount: num.discount,
                    discountPercentage: num.discountPercentage,
                    startDate: num.startDate,
                    endDate: num.endDate,
                    status: num.status,
                    updatedBy: num.updatedBy

                };

            }));

            logs.newLog.log('info', "Coupon list");
    
            res.send({
                Status: true,
                Message: "Coupon list",
                Data
            })

        }else{

            logs.newLog.log('info', "Please enter required fields");
                    
            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

        }

    }catch(e) {

        console.log(e);

    }

}


const deleteCoupon = async (req, res) => {

    try{

        var {userId, couponId} = req.body;

        if(userId != undefined && userId != "" && couponId[0] != undefined && couponId[0] != ""){

            const usr = req.body.getUser;

            if(usr.role == 1){

                var len = couponId.length;

                for(var i = 0; i<len; i++){

                    var Data = await Coupon.deleteOne({ _id: couponId[i]});

                }

                if(Data.deletedCount == 0){

                    res.send({
                        Status: false,
                        Message: "Failed to delete coupon"
                    })

                    logs.newLog.log('info', "Failed to delete coupon");

                }else{

                    res.send({
                        Status: true,
                        Message: "Coupon deleted successfully"
                    })

                    logs.newLog.log('info', "Coupon deleted successfully");

                }

            }else{

                res.send({
                    Status: false,
                    Message: "Unauthorized to access"
                })

                logs.newLog.log('info', "Unauthorized to access");

            }

        }else{
                    
            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e) {

        console.log(e);

    }

}

module.exports = {addCoupon, editCoupon, couponList, deleteCoupon};
