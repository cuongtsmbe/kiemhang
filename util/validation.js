module.exports = {
    //validate for role type input
    validateRoleInput:function(value){
        const allowedRoleTypes = ["admin", "viewer"];
        if (value.role && !allowedRoleTypes.includes(value.role)) {
            return "role_type must be one of admin, or viewer";
        }

        return true;
    },

    //check value have format datetime in mysql
    isValidMySQLDatetime:function(datetimeString) {
        const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        //return boolean
        return datetimeRegex.test(datetimeString);
    },
      
}