const {getDataFromSheet} = require('./spreadsheetChecker');
const sheet = new getDataFromSheet();

sheet.addUser('this is UID', 1);