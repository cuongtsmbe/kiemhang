const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const authMdw   = require("./mdw/_auth.mdw");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//app.use(authMdw.authorize);

require("./routers/_authentication.router").authRouters(app);

require("./routers/product.router").productRouters(app);

require("./routers/report_import.router").ReportImportRouters(app);

require("./routers/report_export.router").ReportExportRouters(app);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
