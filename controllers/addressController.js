const Address = require('../models/addressModel.js');
const ValetDetail = require('../models/valetDetailModel.js');
const logs = require("./logger.js");


const addAddress = async(req, res) => {

    try{

        const {userId, address, country, state, city, pincode, latitude, longitude, landmark, status} = req.body;

        if(userId != "" && userId != undefined && address != "" && address != undefined && country != "" && country != undefined && state != "" && state != undefined && city != undefined && city != "" && pincode != undefined && pincode != "" && latitude != undefined && latitude != "" && longitude != undefined && longitude != "" && status != undefined && landmark != undefined && landmark != ""){

            var usr = req.body.getUser;

            if(usr.role == 1){

                var Data = new Address ({

                    address: address,
                    country: country,
                    state: state,
                    city: city,
                    pincode: pincode,
                    latitude: latitude,
                    longitude: longitude,
                    landmark: landmark,
                    status: status,
                    updatedBy: userId

                })
    
                await Data.save();
    
                res.send({

                    Status: true,
                    Message: "Address added successfully",
                    Data: {
    
                        address: address,
                        country: country,
                        state: state,
                        city: city,
                        pincode: pincode,
                        latitude: latitude,
                        longitude: longitude,
                        landmark: landmark,
                        status: status,
                        updatedBy: userId

                    }
                })
    
                logs.newLog.log('info', "Address added successfully");

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


const editAddress = async (req, res)=> {

    try{

        const {userId, addressId, address, country, state, city, pincode, latitude, longitude, landmark, status} = req.body;

        if(userId != "" && userId != undefined && addressId != "" && addressId != undefined && address != "" && address != undefined && country != "" && country != undefined && state != "" && state != undefined && city != undefined && city != "" && pincode != undefined && pincode != "" && latitude != undefined && latitude != "" && longitude != undefined && longitude != "" && status != undefined && landmark != undefined && landmark != ""){
               
            var usr = req.body.getUser;

            if(usr.role == 1){

                var Data = ({
    
                    address: address,
                    country: country,
                    state: state,
                    city: city,
                    pincode: pincode,
                    latitude: latitude,
                    longitude: longitude,
                    landmark: landmark,
                    status: status,
                    updatedBy: userId

                })

                const updateStatus = await Address.updateOne({ _id: addressId }, {$set: Data });

                if(updateStatus.modifiedCount == 1){
        
                    res.send({
                        
                        Status: true,
                        Message: "Address edited successfully",
                        Data
                        
                    })

                    logs.newLog.log('info', "Address edited successfully");
    
                }else{
                    
                    res.send({
                        Status: false,
                        Message: "Failed to updated address"
                    })
    
                    logs.newLog.log('info', "Failed to updated address");

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

const addressList = async (req, res) => {

    try{

        const {userId} = req.body;

        if(userId != undefined && userId != ""){

            var usr = req.body.getUser;

            if(usr.role == 1){

                var info = await Address.find().sort({_id: -1});

                var Data = await Promise.all(info.map(async (num) => {

                    return {
    
                        _id: num._id,
                        address: num.address,
                        country: num.country,
                        state: num.state,
                        city: num.city,
                        pincode: num.pincode,
                        latitude: num.latitude,
                        longitude: num.longitude,
                        landmark: num.landmark,
                        status: num.status,
                        updatedBy: num.updatedBy
    
                    };
    
                }));
    
                logs.newLog.log('info', "Address list");
        
                res.send({
                    Status: true,
                    Message: "Address list",
                    Data
                })

            }else{

                res.send({
                    Status: false,
                    Message: "Unauthorized to access"
                })

                logs.newLog.log('info', "Unauthorized to access");

            }


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


const assignAddressList = async (req, res) => {

    try{

        const {userId} = req.body;

        if(userId != undefined && userId != ""){

            var usr = req.body.getUser;

            if(usr.role == 1){

                var info = await Address.find({status: 1}).sort({_id: -1});
    
                var Data = await Promise.all(info.map(async (num) => {
    
                    return {
    
                        _id: num._id,
                        address: num.address,
                        country: num.country,
                        state: num.state,
                        city: num.city,
                        pincode: num.pincode,
                        latitude: num.latitude,
                        longitude: num.longitude,
                        landmark: num.landmark,
                        status: num.status,
                        updatedBy: num.updatedBy
    
                    };
    
                }));
            
                res.send({
                    Status: true,
                    Message: "Assign address list",
                    Data
                })

                logs.newLog.log('info', "Assign address list");

            }else{

                res.send({
                    Status: false,
                    Message: "Unauthorized to access"
                })

                logs.newLog.log('info', "Unauthorized to access");

            }


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


const deleteAddress = async (req, res) => {

    try{

        var {userId, addressId} = req.body;

        if(userId != undefined && userId != "" && addressId[0] != undefined && addressId[0] != ""){

            const usr = req.body.getUser;

            if(usr.role == 1){

                var len = addressId.length;

                for(var i = 0; i<len; i++){

                    var Data = await Address.deleteOne({ _id: addressId[i]});

                }

                if(Data.deletedCount == 0){

                    res.send({
                        Status: false,
                        Message: "Failed to delete address"
                    })

                    logs.newLog.log('info', "Failed to delete address");

                }else{

                    res.send({
                        Status: true,
                        Message: "Address deleted successfully"
                    })

                    logs.newLog.log('info', "Address deleted successfully");

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

const assignUserAdd = async (req, res) => {

    try{

        const {userId, assignId, addressId} = req.body;

        if(userId != undefined && userId != "" && assignId != undefined && assignId != "" && addressId != undefined && addressId != ""){

            var usr = req.body.getUser;

            if(usr.role == 1){

                var info = await Address.findOne({$and:[{_id: addressId}, {status: 1}]});

                if(info != null){

                    var foundVale = await ValetDetail.findOne({userId: assignId});

                    if(foundVale == null){

                        var Data = new ValetDetail ({

                            userId: assignId,
                            address: info.address + ", " + info.city + ", " + info.state + ", " + info.country + ", " + info.pincode + ".",
                            latitude: info.latitude,
                            longitude: info.longitude,
                            currentStatus: 0,
                            updatedBy: userId
                        })

                        await Data.save();

                        res.send({
                            Status: true,
                            Message: "Address assign successfully",
                            Data
                        })
        
                        logs.newLog.log('info', "Address assign successfully");

                    }else{

                        var Data = {
                            
                            address: info.address + ", " + info.city + ", " + info.state + ", " + info.country + ", " + info.pincode + ".",
                            latitude: info.latitude,
                            longitude: info.longitude,
                            currentStatus: 0,
                            updatedBy: userId
                        }

                        const updateStatus = await ValetDetail.updateOne({ userId: assignId }, {$set: Data });

                        if(updateStatus.modifiedCount == 1){
                
                            res.send({
                                Status: true,
                                Message: "Address updated successfully",
                                Data
                            })
            
                            logs.newLog.log('info', "Address updated successfully");
            
                        }else{
                            
                            res.send({
                                Status: false,
                                Message: "Failed to update address"

                            })
            
                            logs.newLog.log('info', "Failed to update address");
        
                        }

                    }
                

                }else{

                    res.send({
                        Status: false,
                        Message: "Address not found"
                    })
    
                    logs.newLog.log('info', "Address not found");

                }

            }else{

                res.send({
                    Status: false,
                    Message: "Unauthorized to access"
                })

                logs.newLog.log('info', "Unauthorized to access");

            }


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

module.exports = {addAddress, editAddress, addressList, assignAddressList, deleteAddress, assignUserAdd};