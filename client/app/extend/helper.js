'use strict';
const utility = require('utility');
const XLSX = require('xlsx');
module.exports = {
  md5Compare(str, md5) {
    return md5 === utility.md5(str).toLocaleLowerCase();
  },
  validateError(e) {
    const { ctx } = this;
    ctx.logger.error(e);
    ctx.body = {
      code: 1,
      message: ctx.__('validate_failure'),
    };
  },
  createVerfCode(length = 5) {
    const code = Math.random() * Math.pow(10, length);
    return code.toString();
  },
  parseXlsx(file) {
    const workbook = XLSX.readFile(file);
    const sheetNames = workbook.SheetNames;
    const workSheet = workbook.Sheets[sheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(workSheet);
    const ethMap = new Map();
    jsonData.forEach(item => {
      ethMap.set(item.eth_address, item);
    });
    
    return ethMap;
  },
};
