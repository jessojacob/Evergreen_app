const key = process.env.key
const SERVICE_ACCT_ID = 'node-project-jesso@crud-application-node-master.iam.gserviceaccount.com';
const CALENDAR_ID = {
    'primary': '8ef4s360m3s9qd0ictes0hsmg8@group.calendar.google.com'
};
const TIMEZONE = 'GMT+05:30';

console.log('key: '+key )

 
module.exports.key = key;           //or if using json keys - module.exports.key = key; 
module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.calendarId = CALENDAR_ID;
module.exports.timezone = TIMEZONE;