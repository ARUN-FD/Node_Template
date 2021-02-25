const {ReE,ReS,TE, isNull} = require('./util.service')
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = require('http-status')

const ReturnEmptyError = (res, message) => {
    return ReE(res, { message: message }, BAD_REQUEST);
}

exports.ReturnEmptyError = ReturnEmptyError;

const ReturnInternalError = (res,err) => {
    console.log(err)
    return ReE(res,err,INTERNAL_SERVER_ERROR);
}

exports.ReturnInternalError = ReturnInternalError;

const ReturnSuccess = (res,message,data) => {
    if(data){
        return ReS(res,{message: message, data: data},OK)
    }else{
        return ReS(res,{message: message},OK)
    }
}

exports.ReturnSuccess = ReturnSuccess;

const ThrowError = (content) => {
    return TE(content);
}

exports.ThrowError = ThrowError;

const ThrowInLog = (content) => {
    return TE(content, true);
}

exports.ThrowInLog = ThrowInLog;

const mandodary = (res,data, fields) => {
    let invalidFields = fields.filter(x=>{
        return isNull(data[x]);
    })
    if(invalidFields.length>0) return ReturnEmptyError(res, `enter value for ${invalidFields}`);
}

exports.mandodary = mandodary;