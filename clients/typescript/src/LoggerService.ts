import * as winston from "winston";

export class LoggerService {
  static createLogger = (): winston.Logger => {
    const logConfiguration: winston.LoggerOptions = {
      levels: winston.config.npm.levels,
      level: process.env.LOG_LEVEL || "debug",
      transports: [new winston.transports.Console()],
    };
    return winston.createLogger(logConfiguration);
  };
}
