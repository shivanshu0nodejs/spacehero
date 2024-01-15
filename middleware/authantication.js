const jwt =  require('jsonwebtoken');
const User = require("../models/userModel.js");
const logs = require("../controllers/logger.js");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {

    try{

        logs.newLog.log('info', `INSIDE AUTHENTICATION ${JSON.stringify(req.body)}`);

        var {userId} = req.body;

        if(userId){

            const data = await User.findOne({userId: userId});

            if(data){
    
                req.body.getUser = data;
        
                const token = data.tokens;
    
                jwt.verify(token, secretKey, async(err, authData)=>{
    
                    if(err){
                        res.send({
                            Status: true,
                            Message: "Authentication failed",
                            authData
                        })

                    }else{
    
                        next();
    
                    }
                })
        
            }else{
        
                res.send({
                    Status: false,
                    Message: "User Id not found"
                })
        
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

module.exports = {verifyToken};
