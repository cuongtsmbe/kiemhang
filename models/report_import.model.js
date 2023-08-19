const db = require('../util/db');
const TABLE="report_import";

module.exports={
    getAll:function(){
        return db.load(`
        SELECT
        product.id,
        product.name,
        SUM(import_product.quantity) AS import_product_sum,
        SUM(${TABLE}.quantity) AS ${TABLE}_product_sum
        FROM
            product
        JOIN
            import_product ON product.id = import_product.id_product
        JOIN
            ${TABLE} ON import_product.id = ${TABLE}.id_import_product
        GROUP BY
            product.id, product.name;
        `);
    },

    add:function(value){
        return db.insert(TABLE,value);
    },
}