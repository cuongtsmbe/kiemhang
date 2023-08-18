const db = require('../util/db');
const TABLE="otp";

module.exports={
    getOne:function(condition){
        return db.getOneByCondition(TABLE,condition);
    },

    getVerifyOtp:function(condition){
        return db.load(`SELECT * FROM ${TABLE} WHERE ? AND ?`,[{email:condition.email},{code:condition.code}])
    },

    add:function(value){
        return db.insert(TABLE,value);
    },

    update:function(condition,value){
        return db.load(`UPDATE ${TABLE} SET ? WHERE ?`,[value,condition]);
    },

    delete:function(condition){
        return db.delete(TABLE,condition);
    }
}