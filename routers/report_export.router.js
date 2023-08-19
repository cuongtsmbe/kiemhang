const LINK = require("../util/links.json");
require('dotenv').config();
const ReportExportModel = require("../models/report_export.model");
const ExportProduct = require("../models/export_product.model");
module.exports = {
    ReportExportRouters:function(app){
        app.get(    LINK.CLIENT.REPORT_EXPORT_PRODUCT                          ,this.getAll);
        app.post(   LINK.CLIENT.REPORT_EXPORT_PRODUCT                          ,this.add);
       
    },

    getAll:async function(req,res,next){
        try{
            var report=await ReportExportModel.getAll();

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
            id_export_product               :req.body.id_export_product,   
            quantity                        :req.body.quantity
        };

        if(!value.id_export_product || !value.quantity){
            return res.status(400).json({
                code:400,
                message:"id_import_product,quantity not empty."
            });
        }

        try{

             //insert to Db
             var getExportProduct = await ExportProduct.getOne({id: value.id_export_product});

             if(getExportProduct.length==0){
                 return res.status(400).json({
                         code:400,
                         message:"id_import_product not exsit."
                     })
                 
             }

            //insert to Db
            var result=await ReportExportModel.add(value);

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