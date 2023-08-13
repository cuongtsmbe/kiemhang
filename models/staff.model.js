const db = require('../util/db');
const TABLE="staff";

module.exports={
    //get details user(saler) by ID
    getOne:function(condition){
        return db.getOneByCondition(TABLE,condition);
    },

    //add new user 
    add:function(value){
        return db.insert(TABLE,value);
    },

    //update infomation user by condition user id
    update:function(condition,value){
        return db.load(`UPDATE ${TABLE} SET ? WHERE ?`,[value,condition]);
    },

    //delete user
    delete:function(condition){
        return db.delete(TABLE,condition);
    }
}