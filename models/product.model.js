const db = require('../util/db');
const TABLE_IMPORT="import_product";
const TABLE_EXPORT="export_product";
const TABLE_PRODUCT="product";

module.exports={
    //get details user(saler) by ID
    getListProductImport:function(condition){
        return db.getListProductImport({TABLE_IMPORT,TABLE_PRODUCT},condition);
    },
    getListProductExport:function(condition){
        return db.getListProductExport({TABLE_EXPORT,TABLE_PRODUCT},condition);
    },
}