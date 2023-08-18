const staffModel = require("../models/staff.model");
const crypto=require('crypto');
const LINK = require("../util/links.json");
const str2ab = require('string-to-arraybuffer');
const tokenUtil = require("../util/token");
const { v4: uuidv4 } = require("uuid");
const Utilvalidate = require("../util/validation");
const email = require("../util/email");

require('dotenv').config();

module.exports = {
    authRouters:function(app){
        app.post(    LINK.CLIENT.AUTHENTICATION_LOGIN                           ,this.loginLocal);
        app.post(    LINK.CLIENT.AUTHENTICATION_CREATE_ACCESSTOKEN              ,this.createAccessToken);
        app.post(    LINK.CLIENT.AUTHENTICATION_REGISTER                        ,this.register);
        app.get(     LINK.CLIENT.AUTHENTICATION_FORGET_PW                       ,this.getOtp);
        app.post(    LINK.CLIENT.AUTHENTICATION_FORGET_PW                       ,this.verifiedOtp);
        app.post(    LINK.CLIENT.AUTHENTICATION_UPDATE_PW                       ,this.updatePw);
    },

    //LOGIN LOCAL
    loginLocal:async function(req,res,next){
        var value={
            gmail:req.body.gmail,
            password:req.body.password 
        };

        if(!value.gmail || !value.password){
            return res.status(400).json({
                code    :40,
                message :"user_name or password empty/null/undefined."
            });
        }      
        
        try{
            value.gmail = value.gmail.trim();
            //kiem tra username có tồn tại chưa
            var user=await staffModel.getOne({gmail:value.gmail});

            if(0 == user.length){
                return res.status(400).json({
                    code:400,
                    message:"Incorrect username or password."
                });   
            }

        }catch(e){
            console.log(e);
            return res.status(500).json({
                code:500,
                message:"Server error."
            });;
        }

        user=user[0];
        try{
            //kiểm tra password(chua hash) với password của user trên DB 
            crypto.pbkdf2(value.password,process.env.SALT_PASSWORD, 310000,32, 'sha256',async function(err, hashedPassword) {
                if (err) {
                    res.status(500).json({
                        code:50,
                        message:"Server error."
                    });            
                    return false;
                }
                //cover to String hex 
                try{
                    hashedPassword=hashedPassword.toString("hex");
                    //check user password in DB and value.password had hash
                    if (!crypto.timingSafeEqual(str2ab(String(user.password)),str2ab(String(hashedPassword)))) {
                        return res.status(400).json({
                            code:400,
                            message:"Incorrect username or password."
                        });   
                    }

                    try{
                        //Create and assign token
                        return res.status(200).json(tokenUtil.GetAccessTokenAndRefreshTokenOfUser(user));

                    }catch(e){
                        console.log(e);
                        return res.status(500).json({
                            code    :500,
                            message :"server error."
                        });
                    }
                    
                }catch(err){
                    console.log(err);
                    return res.status(400).json({
                        code:400,
                        message:"Account don't register for login local"
                    })
                }      
            });
        }catch(err){
            console.log(err);
            return res.status(500).json({
                code    :500,
                message :"server error."
            });
        }
    },


    //create accesstoken from refreshtoken
    createAccessToken:async function(req,res,next){
        //kiểm tra  refreshToken
        try{
            var refreshToken=req.body.refreshToken;
        
            if(!refreshToken){
                    return res.status(400).json({
                        code    :40,
                        message :"refreshToken empty/null/undefined."
                    });
            }        

            //verified resfreshToken 
            const verified = tokenUtil.verifyToken(refreshToken, process.env.TOKEN_SECRET_REFRESHTOKEN);  
          
            try{
                return res.status(200).json(tokenUtil.GetAccessToken(verified));
            }catch(e){
                return res.status(500).json({
                    code    :51,
                    message :"server error."
                });
            }
       }catch(err){

            return res.status(400).json({
                code    :41,
                message :err
            });

       } 
   },

    register:async function(req,res,next){
        var value={
            id              :uuidv4(),    
            name            :req.body.name,   
            position        :req.body.position || "",  
            gmail           :req.body.gmail, 
            address         :req.body.address,        
            username        :" ",      
            password        :req.body.password,        
            role            :req.body.role,          
        };

        if(!value.name || !value.address || !value.gmail || !value.password){
            return res.status(400).json({
                code:400,
                message:"name,address,gmail,password ."
            });
        }

        try{

            if(Utilvalidate.validateRoleInput({role:value.role})!=true){
                return res.status(400).json({
                    code:400,
                    message:"role is admin or viewer ."
                });
            }
            //check user name had exist in DB
            var data = await staffModel.getOne({gmail:value.gmail});

            if(data.length>0){
                return res.status(400).json({
                    code:41,
                    message:`Register failed. ${value.gmail} had exist in DB.`
                });
            }

            //hash password and response
            crypto.pbkdf2(value.password,process.env.SALT_PASSWORD, 310000,32, 'sha256',async function(err, hashedPassword) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        code:50,
                        message:"Server error."
                    });            
                    return false;
                }

                //cover to String hex 
                hashedPassword=hashedPassword.toString("hex");

                //save password hash
                value.password = hashedPassword;

                //insert to Db
                var result=await staffModel.add(value);

                if(result.length==0 || result.affectedRows==0){
                    return res.status(400).json({
                            code:400,
                            message:"Register Fail."
                        })
                }
                return  res.status(200).json({
                            status:200,
                            message:"Register success."
                        })
            }); 

        }catch(e){
            console.log(e);
            return res.status(500).json({
                    code:50,
                    message:"server error."
                });
        }
    },

    getOtp: async function(req,res,next){
        var value={
            gmail           :req.query.gmail,         
        };
        const sendMail= await email.sendOTP(value.gmail);
        if(!sendMail){
            return res.status(500).json({
                code:50,
                message:"server send mail error."
            });
        }

        return res.status(200).json({
            code:200,
            message:"Please check email."
        });
    },

    verifiedOtp: async function(req,res,next){

        var value={
            code            :req.body.code,
            gmail           :req.body.gmail,         
        };
        const sendMail= await email.verifyOTP(value.code,value.gmail);

        if(!sendMail){
            return res.status(500).json({
                code:50,
                message:"OTP not verify."
            });
        }

        try{
            value.gmail = value.gmail.trim();
            //kiem tra username có tồn tại chưa
            var user=await staffModel.getOne({gmail:value.gmail});

            if(0 == user.length){
                return res.status(400).json({
                    code:400,
                    message:"User not found."
                });   
            }

        }catch(e){
            console.log(e);
            return res.status(500).json({
                code:500,
                message:"Server error."
            });;
        }

        user=user[0];
        return res.status(200).json(tokenUtil.GetAccessTokenAndRefreshTokenOfUser(user));
    },

    updatePw: async function(req,res,next){
        var value={
            gmail           :req.body.gmail, 
            password        :req.body.password,                 
        };

        if(!value.gmail || !value.password){
            return res.status(400).json({
                code:400,
                message:"gmail,password ."
            });
        }
        try{
            crypto.pbkdf2(value.password,process.env.SALT_PASSWORD, 310000,32, 'sha256',async function(err, hashedPassword) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        code:50,
                        message:"Server error."
                    });            
                    return false;
                }

                //cover to String hex 
                hashedPassword=hashedPassword.toString("hex");

                //save password hash
                value.password = hashedPassword;

                //insert to Db
                var result=await staffModel.update({email:value.email},{password:value.password});

                if(result.length==0 || result.affectedRows==0){
                    return res.status(400).json({
                            code:400,
                            message:"update pw Fail."
                        })
                }
                return  res.status(200).json({
                            status:200,
                            message:"update pw success."
                        })
            }); 

        }catch(e){
            console.log(e);
            return res.status(500).json({
                    code:50,
                    message:"server error."
                });
        }
    }

}