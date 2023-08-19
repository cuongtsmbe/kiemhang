const db = require('../util/db');
const TABLE="import_product";

module.exports={
    getOne:function(value){
        return db.getOneByCondition(TABLE,value);
    },
}