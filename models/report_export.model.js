const db = require('../util/db');
const TABLE="report_export";

module.exports={
    getAll:function(id_export){
        return db.load(`
        SELECT
        product.id,
        product.name,
        SUM(export_product.quantity) AS export_product_sum,
        SUM(${TABLE}.quantity) AS ${TABLE}_product_sum
        FROM
            product
        JOIN
            export_product ON product.id = export_product.id_product
        JOIN
            ${TABLE} ON export_product.id = ${TABLE}.id_export_product
        GROUP BY
            product.id, product.name;
        `);
    },

    add:function(value){
        return db.insert(TABLE,value);
    },
}