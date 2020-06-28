import * as path from 'path';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import 'winston-daily-rotate-file';

import {config} from './config';

/**
 * Logger with format, log file rotation etc.
 */
class Logger {
    private static readonly dateTimeFormat = 'YYYY-MM-DD HH:mm:ss.SSS';

    private readonly tag: string;
    private readonly level: string;
    private readonly logger: winston.Logger;

    constructor(tag: string, level?: string) {

        this.tag = tag;

        // log level override logic

        // config tag level > param level > config default level
        if (config.log.tagLevel[tag]) {
            this.level = config.log.tagLevel[tag];
        } else if (level) {
            this.level = level;
        } else {
            this.level = config.log.defaultLevel;
        }

        // add output target start
        const transports: Transport[] = [new winston.transports.Console()];

        if (config.log.file.enable) {
            // log path
            const logDir = path.join(__dirname, '../logs/');
            transports.concat(new winston.transports.DailyRotateFile({
                dirname: logDir,
                filename: logDir + `%DATE%-${process.pid}.log`,
                datePattern: 'YYYY-MM-DD',
                maxSize: config.log.file.maxSize,
                maxFiles: config.log.file.maxFiles,
            }));
        }
        // add output target end

        const format = winston.format;
        this.logger = winston.createLogger({
            level: this.level,
            format: format.combine(
                format.colorize({all: true}),
                format.timestamp({format: Logger.dateTimeFormat}),
                format.label({label: this.tag}),
                format.errors({stack: false}),
                format.splat(),
                format.printf((info) => {

                    // change log format here

                    // current format eg.: 2099-02-23 23:59:59.999 - 99999 - info - app - App launched.
                    return `${info.timestamp} - ${process.pid} - ${info.level} - ${info.label} - ${info.message}`;
                })
            ),
            defaultMeta: {
                service: this.tag,
            },
            transports
        });
    }

    joinMsg(messages: any[]) {
        let result = '';
        for (const msg of messages) {
            // str num ...
            if (typeof msg !== 'object') {
                result += msg.toString();
            } else {
                result += JSON.stringify(msg);
            }
            result += ' ';
        }
        return result;
    }

    // add your log levels here
    // remember to adjust levels in winston

    error(...messages: any[]) {
        const msg = this.joinMsg(messages);
        this.logger.error(msg);
    }

    warn(...messages: any[]) {
        const msg = this.joinMsg(messages);
        this.logger.warn(msg);
    }

    info(...messages: any[]) {
        const msg = this.joinMsg(messages);
        this.logger.info(msg);
    }

    debug(...messages: any[]) {
        const msg = this.joinMsg(messages);
        this.logger.debug(msg);
    }
}

/**
 * Generate a logger with tag.
 * @param {string} tag Logger tag.
 * @param {string} level If given, will override config.defaultLevel;
 * Override by config.tagLevel.
 * @returns {Logger}
 */
function getLogger(tag: string, level?: string) {
    return new Logger(tag, level);
}

export {
    Logger,
    getLogger
};
