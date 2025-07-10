type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;
  private prefix: string;

  constructor(prefix: string = '[App]', config?: Partial<LoggerConfig>) {
    this.prefix = prefix;
    this.config = {
      enabled: __DEV__,
      level: 'debug',
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    return `${timestamp} ${this.prefix} [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message), data || '');
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), data || '');
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), data || '');
    }
  }

  error(message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error || '');
    }
  }

  // Create a child logger with a new prefix
  child(prefix: string): Logger {
    return new Logger(`${this.prefix} ${prefix}`, this.config);
  }
}

// Export singleton for app-wide logging
export const logger = new Logger();

// Export class for creating specialized loggers
export { Logger }; 