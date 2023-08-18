const tokenUtil = require("../util/token");
require('dotenv').config();
const LINK = require("../util/links.json");

module.exports={
    //Authorization middleware 
    authorize:async function (req, res, next) {
        let token = req.header('Authorization');
        let req_url = req.originalUrl;

        console.log(req.method+" - "+req_url);

        //không có Token có thể vào các đường dẫn
        if(!token && (
                //login local
                    req_url.includes(LINK.CLIENT.AUTHENTICATION_LOGIN) 
                ||  req_url.includes(LINK.CLIENT.AUTHENTICATION_REGISTER)
                ||  req_url.includes(LINK.CLIENT.AUTHENTICATION_CREATE_ACCESSTOKEN)
                ||  req_url.includes(LINK.CLIENT.AUTHENTICATION_FORGET_PW)
        ) ){
            next();
            return ;
        }

        if (!token) return res.status(401).send("Unauthorized");

        try {
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length).trimLeft();
            }
            const verified = tokenUtil.verifyToken(token, process.env.TOKEN_SECRET_ACCESSTOKEN); 

            //check permission for viewer
            if( verified.role_type === 'viewer' ){ 
                //nếu là viewer chỉ được phép xem 
                if(req.method !== "GET"){
                    return res.status(403).send("Access Denied");
                }
            }
            
            req.user = verified;
            next();
        }
        catch (err) {
            //token verify fail
            if(
                req_url.includes(LINK.CLIENT.AUTHENTICATION_LOGIN)
            ||  req_url.includes(LINK.CLIENT.AUTHENTICATION_CREATE_ACCESSTOKEN)
            ||  req_url.includes(LINK.CLIENT.AUTHENTICATION_FORGET_PW)
            ||  req_url.includes(LINK.CLIENT.AUTHENTICATION_REGISTER)
            ){
                next();
            }else{

                return res.status(400).json({
                    code    :400,
                    message :err
                });
            }
        }
    }
}