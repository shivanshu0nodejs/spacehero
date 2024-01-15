const Saddress = require('../models/searchAddressModel.js');
const logs = require("./logger.js");


const addAddress = async(req, res) => {

    try{

        const {userId, heading, detail, lat, long} = req.body;

        if(userId != "" && userId != undefined && heading != "" && heading != undefined && detail != "" && detail != undefined && lat != "" && lat != undefined && long != undefined && long != ""){

            var Data = new Saddress ({

                userId: userId,
                heading: heading,
                detail: detail,
                lat: lat,
                long: long,
                status: 0
            })

            await Data.save();

            res.send({
                Status: true,
                Message: "Address added successfully",
                Data: {

                    userId: userId,
                    heading: heading,
                    detail: detail,
                    lat: lat,
                    long: long,
                    status: 0
                }
            })

            logs.newLog.log('info', "Address added successfully");

            var totalAdd = await Saddress.find({$and:[{userId: userId}, {status: 0}]});

            var total = totalAdd.length;

            if(total > 3){

                // Assuming Saddress is your Mongoose model

                // Step 1: Sort the array based on a date field (assuming you have a date field called 'createdAt')
                totalAdd.sort((a, b) => b.createdAt - a.createdAt);

                // Step 2: Identify the documents to delete (all except the latest 3)
                const documentsToDelete = totalAdd.slice(3);

                // Step 3: Use deleteMany to delete the unwanted documents
                const deleteResult = await Saddress.deleteMany({
                _id: { $in: documentsToDelete.map(doc => doc._id) }
                });

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


const savedAddress = async(req, res) => {

    try{

        const {userId, addressId, status} = req.body;

        if(userId != "" && userId != undefined && addressId != "" && addressId != undefined && status != undefined){

            if(status == 0){

                var newData = {

                    status: 1
    
                }

            }else if(status == 1){

                var newData = {

                    status: 0
    
                }

            }

            const updateAddress = await Saddress.updateOne({ _id: addressId }, {$set: newData });
        
            if(updateAddress.modifiedCount == 1){

                res.send({
                    Status: true,
                    Message: "Saved updated"
                })

                var totalAdd = await Saddress.find({$and:[{userId: userId}, {status: 0}]});

                var total = totalAdd.length;
    
                if(total > 3){
    
                    // Assuming Saddress is your Mongoose model
    
                    // Step 1: Sort the array based on a date field (assuming you have a date field called 'createdAt')
                    totalAdd.sort((a, b) => b.createdAt - a.createdAt);
    
                    // Step 2: Identify the documents to delete (all except the latest 3)
                    const documentsToDelete = totalAdd.slice(3);
    
                    // Step 3: Use deleteMany to delete the unwanted documents
                    await Saddress.deleteMany({_id: { $in: documentsToDelete.map(doc => doc._id) }

                    });
    
                }

                var totalAdd2 = await Saddress.find({$and:[{userId: userId}, {status: 1}]});

                var total2 = totalAdd2.length;
    
                if(total2 > 3){
    
                    // Assuming Saddress is your Mongoose model
    
                    // Step 1: Sort the array based on a date field (assuming you have a date field called 'createdAt')
                    totalAdd2.sort((a, b) => b.createdAt - a.createdAt);
    
                    // Step 2: Identify the documents to delete (all except the latest 3)
                    const documentsToDelete2 = totalAdd2.slice(3);
    
                    // Step 3: Use deleteMany to delete the unwanted documents
                    await Saddress.deleteMany({_id: { $in: documentsToDelete2.map(doc => doc._id) }
                    
                    });
    
                }

                logs.newLog.log('info', "Saved updated");


            }else{

                res.send({
                    Status: false,
                    Message: "Failed to update"
                })

                logs.newLog.log('info', "Failed to update");

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


const recentList = async (req, res) => {

    try{

        const {userId} = req.body;

        if(userId != undefined && userId != ""){

            var info = await Saddress.find({$and:[{userId: userId}, {status: 0}]}).sort({_id: -1}).limit(3);
    
            var Data = await Promise.all(info.map(async (num) => {

                return {

                    userId: userId,
                    heading: num.heading,
                    detail: num.detail,
                    lat: num.lat,
                    long: num.long,
                    status: num.status

                };

            }));

            logs.newLog.log('info', "Recent address list");
    
            res.send({
                Status: true,
                Message: "Recent address list",
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


const savedList = async (req, res) => {

    try{

        const {userId} = req.body;

        if(userId != undefined && userId != ""){

            var info = await Saddress.find({$and:[{userId: userId}, {status: 1}]}).sort({_id: -1}).limit(3);
    
            var Data = await Promise.all(info.map(async (num) => {

                return {

                    userId: userId,
                    heading: num.heading,
                    detail: num.detail,
                    lat: num.lat,
                    long: num.long,
                    status: num.status

                };

            }));

            logs.newLog.log('info', "Saved address list");
    
            res.send({
                Status: true,
                Message: "Saved address list",
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


module.exports = {addAddress, savedAddress, recentList, savedList};