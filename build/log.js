"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");
const config_1 = require("./config");
/**
 * Logger with format, log file rotation etc.
 */
class Logger {
    constructor(tag, level) {
        this.tag = tag;
        // log level override logic
        // config tag level > param level > config default level
        if (config_1.config.log.tagLevel[tag]) {
            this.level = config_1.config.log.tagLevel[tag];
        }
        else if (level) {
            this.level = level;
        }
        else {
            this.level = config_1.config.log.defaultLevel;
        }
        // add output target start
        const transports = [new winston.transports.Console()];
        if (config_1.config.log.file.enable) {
            // log path
            const logDir = path.join(__dirname, '../logs/');
            transports.concat(new winston.transports.DailyRotateFile({
                dirname: logDir,
                filename: logDir + `%DATE%-${process.pid}.log`,
                datePattern: 'YYYY-MM-DD',
                maxSize: config_1.config.log.file.maxSize,
                maxFiles: config_1.config.log.file.maxFiles,
            }));
        }
        // add output target end
        const format = winston.format;
        this.logger = winston.createLogger({
            level: this.level,
            format: format.combine(format.colorize({ all: true }), format.timestamp({ format: Logger.dateTimeFormat }), format.label({ label: this.tag }), format.errors({ stack: false }), format.splat(), format.printf((info) => {
                // change log format here
                // current format eg.: 2099-02-23 23:59:59.999 - info: app - App launched. PID: 99999
                return `${info.timestamp} - ${process.pid} - ${info.level} - ${info.label} - ${info.message}`;
            })),
            defaultMeta: {
                service: this.tag,
            },
            transports
        });
    }
    joinMsg(messages) {
        let result = '';
        for (const msg of messages) {
            // str num ...
            if (typeof msg !== 'object') {
                result += msg.toString();
            }
            else {
                result += JSON.stringify(msg);
            }
            result += ' ';
        }
        return result;
    }
    // add your log level here
    // remember to adjust level in winston
    error(...messages) {
        const msg = this.joinMsg(messages);
        this.logger.error(msg);
    }
    warn(...messages) {
        const msg = this.joinMsg(messages);
        this.logger.warn(msg);
    }
    info(...messages) {
        const msg = this.joinMsg(messages);
        this.logger.info(msg);
    }
    debug(...messages) {
        const msg = this.joinMsg(messages);
        this.logger.debug(msg);
    }
}
exports.Logger = Logger;
Logger.dateTimeFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
/**
 * Generate a logger with tag.
 * @param {string} tag Logger tag.
 * @param {string} level If given, will override config.defaultLevel;
 * Override by config.tagLevel.
 * @returns {Logger}
 */
function getLogger(tag, level) {
    return new Logger(tag, level);
}
exports.getLogger = getLogger;
//# sourceMappingURL=log.js.map