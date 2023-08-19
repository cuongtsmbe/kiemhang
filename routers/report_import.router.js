const LINK = require("../util/links.json");
require('dotenv').config();
const ReportImportModel = require("../models/report_import.model");
const ImportProduct = require("../models/import_product.model");
module.exports = {
    ReportImportRouters:function(app){
        app.get(    LINK.CLIENT.REPORT_IMPORT_PRODUCT                          ,this.getAll);
        app.post(   LINK.CLIENT.REPORT_IMPORT_PRODUCT                          ,this.add);
       
    },

    getAll:async function(req,res,next){
        try{
            var report=await ReportImportModel.getAll();

            return res.status(200).json({
                code:200,
                message:report
            });  

        }catch(e){
            console.log(e);
            return res.status(500).json({
                code:500,
                message:"Server error."
            });;
        }
    },

    add: async function(req,res,next){
        var value={
            id_import_product               :req.body.id_import_product,   
            quantity                        :req.body.quantity
        };

        if(!value.id_import_product || !value.quantity){
            return res.status(400).json({
                code:400,
                message:"id_import_product,quantity not empty."
            });
        }

        try{
            //insert to Db
            var getImportProduct = await ImportProduct.getOne({id: value.id_import_product});

            if(getImportProduct.length==0){
                return res.status(400).json({
                        code:400,
                        message:"id_import_product not exsit."
                    })
                
            }

            var result=await ReportImportModel.add(value);

            if(result.length==0 || result.affectedRows==0){
                return res.status(400).json({
                        code:400,
                        message:"Insert Fail."
                    })
            }
            return  res.status(200).json({
                        status:200,
                        message:"Insert success."
                    })

        }catch(e){
            console.log(e);
            return res.status(500).json({
                    code:50,
                    message:"server error."
                });
        }
    }
}