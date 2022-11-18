const {validationResult} = require("express-validator");
const {notFound, serverError, build} = require("./responses");

exports.groupArrayByKey = (array, key) => {
    return array
        .reduce((hash, obj) => {
            if(obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
        }, {})
}

exports.validationResult = (request) => {
    const errorFormatter = ({ msg, param, value }) => {
        return {
            field: param,
            message: msg,
            value,
        };
    };

    const response = {
        isEmpty: () => true,
        errors: undefined
    }

    const result = validationResult(request).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        response.isEmpty = () => false
        response.errors = {
            state: 'failed',
            message: 'Validation failed',
            errors: exports.groupArrayByKey(result.array(), 'field')
        }
    }

    return response
}

exports.handleErrors = (app) => {
    app.use(function(error, req, res, next){
        console.log(error)

        if (error?.code) {
            return build({
                response: res,
                statusCode: error.code,
                message: error.message
            })
        }

        return serverError(res)
    });

    app.use(function(req, res){
        notFound(res,"Sorry, we couldn't find that!" )
    });
}

exports.dateAdd =  (date, interval, units) => {
    if(!(date instanceof Date))
        return undefined;
    let ret = new Date(date); //don't change original date
    const checkRollover = function () {
        if (ret.getDate() !== date.getDate()) ret.setDate(0);
    };

    switch(String(interval).toLowerCase()) {
        case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
        case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
        case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
        case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
        case 'day'    :  ret.setDate(ret.getDate() + units);  break;
        case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
        case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
        case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
        default       :  ret = undefined;  break;
    }
    return ret;
}