const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports={
    //get accesstoken and refreshtoken for user
    GetAccessTokenAndRefreshTokenOfUser:function(user){
        var payload={
                id                  :user.id,
                gmail               :user.gmail,
                role                :user.role,
                iat                 :Math.floor(Date.now() / 1000),
        };

        //create AccessToken AND refreshToken
        const AccessToken = jwt.sign(payload, process.env.TOKEN_SECRET_ACCESSTOKEN,{ expiresIn: "1d"});
        const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET_REFRESHTOKEN,{ expiresIn:"30d" });
        
        //reponse
        return {
            code:200,
            message:"Login success.",
            user:{
                id              :user.id,
                gmail           :user.gmail,
                AccessToken     :AccessToken,
                refreshToken    :refreshToken
            }

        };  
    },

    //get accesstoken 
    GetAccessToken:function(user){
        var payload={
                id                  :user.id,
                gmail               :user.gmail,
                role                :user.tole,
                iat                 :Math.floor(Date.now() / 1000),
        };

        //create AccessToken 
        const AccessToken = jwt.sign(payload, process.env.TOKEN_SECRET_ACCESSTOKEN,{ expiresIn: "1d"});
       
        //reponse
        return {
                code:20,
                message:"get accesstoken success.",
                user:{
                    id          :user.id,
                    gmail       :user.gmail,
                    AccessToken     :AccessToken,
                }
        };  
    },

    //verify accesstoken/refreshtoken 
    verifyToken:function(token,key){
        return jwt.verify(token,key);  
    }
}
  