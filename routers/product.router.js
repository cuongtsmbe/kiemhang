const LINK = require("../util/links.json");
require('dotenv').config();
const productModel = require("../models/product.model");
module.exports = {
    productRouters:function(app){
        app.get(    LINK.CLIENT.PRODUCT_IMPORT                           ,this.getProductsImport);
        app.get(    LINK.CLIENT.PRODUCT_EXPORT                           ,this.getProductsExport);
       
    },

    getProductsImport:async function(req,res,next){
        var value={
            id: req.params.idImport
        };
        
        try{
            value.id = value.id.trim();

            var products=await productModel.getListProductImport(value);

            return res.status(200).json({
                code:200,
                message:products
            });  

        }catch(e){
            console.log(e);
            return res.status(500).json({
                code:500,
                message:"Server error."
            });;
        }
    },

    getProductsExport:async function(req,res,next){
        var value={
            id: req.params.idExport
        };
        
        try{
            value.id = value.id.trim();

            var products=await productModel.getListProductExport(value);

            return res.status(200).json({
                code:200,
                message:products
            });  

        }catch(e){
            console.log(e);
            return res.status(500).json({
                code:500,
                message:"Server error."
            });;
        }
    },


}