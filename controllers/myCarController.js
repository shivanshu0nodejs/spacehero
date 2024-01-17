const Car = require('../models/myCarModel.js');
const logs = require("./logger.js");


const addCar = async(req, res) => {

    try{

        const {userId, regNo, fuelType, transmission, carName} = req.body;

        if(userId != "" && userId != undefined && regNo != "" && regNo != undefined && fuelType != "" && fuelType != undefined && transmission != "" && transmission != undefined && carName != undefined){

            var Data = new Car ({

                userId: userId,
                regNo: regNo,
                fuelType: fuelType,
                transmission: transmission,
                carName: carName
            })

            await Data.save();

            res.send({
                Status: true,
                Message: "Car added successfully",
                Data: {

                    userId: userId,
                    regNo: regNo,
                    fuelType: fuelType,
                    transmission: transmission,
                    carName: carName
                }
            })

            logs.newLog.log('info', "Car added successfully");


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


const updateCar = async(req, res) => {

    try{

        const {userId, carId, regNo, fuelType, transmission, carName} = req.body;

        if(userId != "" && userId != undefined && carId != "" && carId != undefined && regNo != "" && regNo != undefined && fuelType != "" && fuelType != undefined && transmission != "" && transmission != undefined && carName != undefined){

            var newData = {

                regNo: regNo,
                fuelType: fuelType,
                transmission: transmission,
                carName: carName

            }

            const updateCar = await Car.updateOne({ _id: carId }, {$set: newData });
        
            if(updateCar.modifiedCount == 1){

                res.send({
                    Status: true,
                    Message: "Car updated successfully"
                })

                logs.newLog.log('info', "Car updated successfully");


            }else{

                res.send({
                    Status: false,
                    Message: "Failed to update car"
                })

                logs.newLog.log('info', "Failed to update car");

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


const deleteCar = async (req, res) => {

    try{

        var {userId, carId} = req.body;

        if(userId != undefined && userId != "" && carId[0] != undefined && carId[0] != ""){

            var len = carId.length;

            for(var i = 0; i<len; i++){

                var Data = await Car.deleteOne({ _id: carId[i]});

            }

            if(Data.deletedCount == 0){

                logs.newLog.log('info', "Failed to delete car");

                res.send({
                    Status: false,
                    Message: "Failed to delete car"
                })

            }else{

                res.send({
                    Status: true,
                    Message: "Car deleted successfully"
                })

                logs.newLog.log('info', "Car deleted successfully");

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


const carList = async (req, res) => {

    try{

        const {userId} = req.body;

        if(userId != undefined && userId != ""){

            var info = await Car.find({userId: userId}).sort({_id: -1});
    
            var Data = await Promise.all(info.map(async (num) => {

                return {

                    _id: num._id,
                    userId: num.userId,
                    regNo: num.regNo,
                    fuelType: num.fuelType,
                    transmission: num.transmission,
                    carName: num.carName

                };

            }));

            logs.newLog.log('info', "Car listing");
    
            res.send({
                Status: true,
                Message: "Car listing",
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

module.exports = {addCar, updateCar, deleteCar, carList};
