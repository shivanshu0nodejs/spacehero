const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middleware/authantication.js");

const User = require("../controllers/userController.js");
const Car = require("../controllers/myCarController.js");
const Saddress = require("../controllers/searchAddressController.js");

// USER ROUTES START //

router.route("/login").post(User.login);
router.route("/loginotp").post(User.loginOtp);
router.route("/addprofile").post(verifyToken, User.addProfile);

// USER ROUTES END //


// CAR ROUTES START //

router.route("/addcar").post(verifyToken, Car.addCar);
router.route("/updatecar").post(verifyToken, Car.updateCar);
router.route("/deletecar").post(verifyToken, Car.deleteCar);
router.route("/carlist").post(verifyToken, Car.carList);


// CAR ROUTES END //


// CAR ROUTES START //

router.route("/addsearchadd").post(verifyToken, Saddress.addAddress);
router.route("/updatesaved").post(verifyToken, Saddress.savedAddress);
router.route("/recentaddress").post(verifyToken, Saddress.recentList);
router.route("/savedaddress").post(verifyToken, Saddress.savedList);


// CAR ROUTES END //


module.exports = router;
