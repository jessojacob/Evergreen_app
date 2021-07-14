const CONFIG = require('../env/config');

const key = CONFIG.key
const SERVICE_ACCT_ID = " ";
const CALENDAR_ID = {
    'primary': ' '
};
const TIMEZONE = 'GMT+05:30';

console.log('key: '+key )

 
module.exports.key = key;           //or if using json keys - module.exports.key = key; 
module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.calendarId = CALENDAR_ID;
module.exports.timezone = TIMEZONE;