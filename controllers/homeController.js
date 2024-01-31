const ValetDetail = require('../models/valetDetailModel.js');
const logs = require("./logger.js");
const haversine = require('haversine');


const home = async (req, res) => {
    try {
        const { userId, latitude, longitude } = req.body;

        if (userId != "" && userId != undefined && latitude != "" && latitude != undefined && longitude != "" && longitude != undefined) {

            // Function to calculate distance between two sets of coordinates using Haversine formula
            function calculateDistance(coord1, coord2) {
                return haversine(coord1, coord2, { unit: 'km' });
            }

            // Function to check if a user's coordinates are within the given radius
            function isWithinRadius(user, centerCoordinates, radius) {
                return calculateDistance(centerCoordinates, { latitude: user.latitude, longitude: user.longitude }) <= radius;
            }

            // Example usage
            const centerCoordinates = { latitude: latitude, longitude: longitude };

            const radius = 5; // 5 km radius

            // Filter allUser array based on coordinates within the radius
            var allUser = await ValetDetail.find({ currentStatus: 1 });
            const usersWithinRadius = allUser.filter(user => isWithinRadius(user, centerCoordinates, radius));

            var msg = "Available";

            if(usersWithinRadius.length == 0){

                msg = "No valet available in your location";
            }

            res.send({
                Status: true,
                Message: "Home page",
                Data: {

                    Valet: usersWithinRadius,
                    Message: msg
                }
            });

            logs.newLog.log('info', "Home page");

        } else {

            res.send({
                Status: false,
                Message: "Please enter required fields"
            });

            logs.newLog.log('info', "Please enter required fields");

        }

    } catch (e) {

        console.log(e);
    }
}

module.exports = { home };