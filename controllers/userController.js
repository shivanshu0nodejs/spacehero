const jwt =  require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const User = require('../models/userModel.js');
const logs = require("./logger.js");

const sph = "SPH";

const login = async(req, res) => {

    try{

        const {phone} = req.body;

        if(phone != null && phone != undefined){

            const userFound = await User.findOne({phone: phone});

            if(userFound != null){

                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 4; i++ ) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }

                const axios = require('axios');
                const FormData = require('form-data');
                let data = new FormData();

                data.append('apikey', 'NmU3ODU1Mzk3YTZhNzE2NjQzNGI3NDM0NDQzMTRiNGM=');
                data.append('numbers', phone);
                data.append('sender', 'LVFITT');

                if(userFound.name){

                    data.append('message', `Dear ${userFound.name}, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                }else{

                    data.append('message', `Dear User, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                }

                let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.textlocal.in/send/',
                headers: { 
                    'Cookie': 'PHPSESSID=t9ptng990ncra53oilasq0mf56', 
                    ...data.getHeaders()
                },
                data : data
                };

                axios.request(config)
                .then((response) => {

                })
                .catch((error) => {
                console.log(error);
                });
    
                res.send({
                    Status: true,
                    Message: "OTP Sent",
                    Data: {

                        Otp: OTP
                    }
                })

                await User.updateOne({phone: phone}, {$set: {otp: OTP}});

                logs.newLog.log('info', "OTP Sent");

            }else if(userFound == null){

                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 4; i++ ) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }

                const axios = require('axios');
                const FormData = require('form-data');
                let data = new FormData();

                data.append('apikey', 'NmU3ODU1Mzk3YTZhNzE2NjQzNGI3NDM0NDQzMTRiNGM=');
                data.append('numbers', phone);
                data.append('sender', 'LVFITT');
                data.append('message', `Dear User, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.textlocal.in/send/',
                headers: { 
                    'Cookie': 'PHPSESSID=t9ptng990ncra53oilasq0mf56', 
                    ...data.getHeaders()
                },
                data : data
                };

                axios.request(config)
                .then((response) => {

                })
                .catch((error) => {
                console.log(error);
                });

                const total = await User.countDocuments({});
    
                if(total>0){
                    
                    const last = await User.find().sort({_id:-1}).limit(1);
                    var numb = last[0].doc_num;

                }else{
                    var numb = 0;
                }
        
                if(total<10 ){
                    var userId = sph.concat("00000",numb + 1);
                }else if(total<100){
                    var userId = sph.concat("0000",numb + 1);
                }else if(total<1000){
                    var userId = sph.concat("000",numb + 1);
                }else if(total<10000){
                    var userId = sph.concat("00",numb + 1);
                }else if(total<100000){
                    var userId = sph.concat("0",numb + 1);
                }

                const totalNum = numb+1;

                const Data = new User ({

                    userId: userId,
                    doc_num: totalNum,
                    phone: phone,
                    otp: OTP,
                    status:0,
                    role:3,
                    tokens:'xxxx'
                    
                })

                await Data.save();

                res.send({
                    Status: true,
                    Message: "OTP Sent",
                    Data: {

                        Otp: OTP
                    }
                })

                logs.newLog.log('info', "OTP Sent");

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

const loginOtp = async(req, res) => {

    try{

        const {phone, otp} = req.body;

        if(phone != null && phone != undefined, otp != null && otp != undefined){

            const userFound = await User.findOne({phone: phone});

            if(userFound != null){

                if(userFound.otp == otp){

                    var isProfile = 0;

                    if(userFound.name != null && userFound.name != undefined){

                        isProfile = 1;

                    }

                    var isVehicle = 0;

                    const Car = require('../models/myCarModel.js');

                    var carFind = await Car.findOne({userId: userFound.userId});

                    if(carFind != null){

                        isVehicle = 1;

                    }

                    var isName = "User";

                    if(userFound.name){

                        isName = userFound.name;

                    }

                    
                    jwt.verify(userFound.tokens, secretKey,(err, authData)=>{

                        if(err){
        
                            jwt.sign({userFound}, secretKey, {expiresIn:'365d'}, async (err, token) => {

                                var newData = {

                                    tokens: token,
                                    status: 1
                                }
        
                                await User.updateOne({ phone: phone }, {$set: newData});
                
                            })
        
                        }})

                        res.send({
                            Status: true,
                            Message: "Login successfull",
                            Data:{
                                userId: userFound.userId,
                                phone: phone,
                                name: isName,
                                isProfile: isProfile,
                                isVehicle: isVehicle
                            }
                        })
        
                    logs.newLog.log('info', "Login successfull");

                }else{

                    res.send({
                        Status: false,
                        Message: "Invalid otp"
                    })
        
                    logs.newLog.log('info', "Invalid otp");

                }
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


const addProfile = async(req, res) => {

    try{

        const {userId, name, gender, referral} = req.body;

        if(userId != null && userId != undefined, name != null && name != undefined){

            var newData = {

                name: name,
                gender: gender,
                referral: referral
            }

            await User.updateOne({ userId: userId }, {$set: newData});

            res.send({
                Status: true,
                Message: "Login successfull",
                Data:{
                    userId: userId,
                    name: name,
                    gender: gender,
                    referral: referral
                }
            })

            logs.newLog.log('info', "Login successfull");

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

module.exports = {login, loginOtp, addProfile};