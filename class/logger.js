'use strict';

const log4js = require('log4js');

log4js.configure({
    appenders: {
        consoleErrors: {
            type: 'stderr',
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} | %5.10p | %10.10c | %m',
            }
        },
        consoleInfo: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} | %5.10p | %10.10c | %m',
            }
        },
        errors: {
            type: 'logLevelFilter',
            appender: 'consoleErrors',
            level: 'warn',
        },
        info: {
            type: 'logLevelFilter',
            appender: 'consoleInfo',
            level: 'trace',
            maxLevel: 'info',
        },
    },
    categories: {
        default: {
            appenders: ['errors', 'info'],
            level: process.env.LOG_LEVEL || 'warn',
        },
        api: {
            appenders: ['errors', 'info'],
            level: process.env.LOG_LEVEL || 'warn',
        }
    },
});
const apiLogger = log4js.getLogger('api');
const defaultLogger = log4js.getLogger('api');
module.exports = {
    defaultLogger, apiLogger,
    apiErrorLog: function(error) {
        const request = {
            path: error.request.path,
            host: error.request.host,
        };
        if (error.response) {
            apiLogger.error("Api request with params %j errored with result %j", request, error.response?.data);
        } else {
            apiLogger.error("Api request %j failed with message %j", request, error.message);
        }
    }
};