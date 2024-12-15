// src/config/logger.ts

import fs from 'fs';
import path from 'path';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private static instance: Logger;
  private logFilePath: string;

  // Private constructor to prevent direct instantiation
  private constructor() {
    const logsDir = path.resolve(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    this.logFilePath = path.join(logsDir, 'application.log');
  }

  // Method to get the single instance of Logger
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Generic log method
  private log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message} ${
      args.length ? JSON.stringify(args) : ''
    }`;

    // Log to console with color coding
    switch (level) {
      case LogLevel.INFO:
        console.log(`\x1b[32m${formattedMessage}\x1b[0m`); // Green
        break;
      case LogLevel.WARN:
        console.warn(`\x1b[33m${formattedMessage}\x1b[0m`); // Yellow
        break;
      case LogLevel.ERROR:
        console.error(`\x1b[31m${formattedMessage}\x1b[0m`); // Red
        break;
      case LogLevel.DEBUG:
        console.debug(`\x1b[34m${formattedMessage}\x1b[0m`); // Blue
        break;
      default:
        console.log(formattedMessage);
    }

    // Append log to file
    fs.appendFile(this.logFilePath, formattedMessage + '\n', (err) => {
      if (err) {
        console.error(`Failed to write to log file: ${err}`);
      }
    });
  }

  // Public methods for different log levels
  public info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  public warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  public error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }

  public debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }
}

export default Logger.getInstance();
