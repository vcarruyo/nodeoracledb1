// create a rolling file logger based on date/time that fires process events
const opts = {
    errorEventName:'error',
        logDirectory:'./log', // NOTE: folder must exist and be writable...
        fileNamePattern:'cbaWebSrv-<DATE>.log',
        dateFormat:'YYYYMMDD'
  };
const log = require('simple-node-logger').createRollingFileLogger( opts );
  
module.exports = {
    info: function (sMsg) {
        log.info(sMsg);
        console.log(sMsg);
    },
    error: function (sMsg) {
        log.error(sMsg);
        console.log(sMsg);
    }
    
}