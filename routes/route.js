const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middleware/authantication.js");
const File = require("../middleware/fileUploads.js");

const Test = require("../controllers/testController.js");
const Home = require("../controllers/homeController.js");
const User = require("../controllers/userController.js");
const Car = require("../controllers/myCarController.js");
const Saddress = require("../controllers/searchAddressController.js");
const Address = require("../controllers/addressController.js");
const Coupon = require("../controllers/couponController.js");
const Document = require("../controllers/documentController.js");



// TEST ROUTES START //

router.route("/").get(Test.homePage);

// TEST ROUTES END //


// HOME ROUTES START //

router.route("/home").post(Home.home);

// HOME ROUTES END //


// USER ROUTES START //

router.route("/login").post(User.login);
router.route("/loginotp").post(User.loginOtp);
router.route("/addprofile").post(verifyToken, User.addProfile);
router.route("/loginvaletotp").post(User.loginValetOtp);
router.route("/valetlogin").post(User.loginValet);
router.route("/addvaletinfo").post(verifyToken, User.addValetInfo);
router.route("/updateprofileimg").post(File.profileImage, verifyToken, User.addProfileImage);



// USER ROUTES END //


// CAR ROUTES START //

router.route("/addcar").post(verifyToken, Car.addCar);
router.route("/updatecar").post(verifyToken, Car.updateCar);
router.route("/deletecar").post(verifyToken, Car.deleteCar);
router.route("/carlist").post(verifyToken, Car.carList);


// CAR ROUTES END //


// SEARCH ADDRESS ROUTES START //

router.route("/addsearchadd").post(verifyToken, Saddress.addAddress);
router.route("/updatesaved").post(verifyToken, Saddress.savedAddress);
router.route("/recentaddress").post(verifyToken, Saddress.recentList);
router.route("/savedaddress").post(verifyToken, Saddress.savedList);


// SEARCH ADDRESS ROUTES END //


// COUPON ROUTES START //

router.route("/addcoupon").post(verifyToken, Coupon.addCoupon);
router.route("/editcoupon").post(verifyToken, Coupon.editCoupon);
router.route("/couponlist").post(verifyToken, Coupon.couponList);
router.route("/deletecoupon").post(verifyToken, Coupon.deleteCoupon);


// COUPON ROUTES END //

// DOCUMENT ROUTES START //

router.route("/documentadd").post(File.documentUpload, verifyToken, Document.addDocument);
router.route("/documentupdate").post(File.documentUpload, verifyToken, Document.UpdateDocument);
router.route("/documentdetail").post(verifyToken, Document.documentDetail);

// DOCUMENT ROUTES END //


// ADDRESS ROUTES START //

router.route("/addressadd").post(verifyToken, Address.addAddress);
router.route("/editaddress").post(verifyToken, Address.editAddress);
router.route("/addresslist").post(verifyToken, Address.addressList);
router.route("/assignaddresslist").post(verifyToken, Address.assignAddressList);
router.route("/deleteaddress").post(verifyToken, Address.deleteAddress);
router.route("/addressvalet").post(verifyToken, Address.assignUserAdd);




// ADDRESS ROUTES END //


module.exports = router;
