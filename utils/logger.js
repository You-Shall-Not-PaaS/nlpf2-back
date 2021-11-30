const {
  createLogger, format, transports, config, addColors,
} = require('winston');

let level; let
  silent;
switch (process.env.NODE_ENV) {
  case 'production':
    silent = false;
    break;
  case 'test':
    silent = true;
    break;
  default:
    silent = false;
    break;
}

const options = {
  console: {
    level,
    silent,
    handleExceptions: true,
    format: format.combine(
      format.colorize(),
      format.splat(),
      format.align(),
      format.timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss',
      }),
      format.printf(
        (info) => `${info.level} ${[info.timestamp]}: ${info.message}`,
      ),
    ),
  },
};

addColors({
  error: 'red',
  warning: 'yellow',
  info: 'green',
  debug: 'cyan',
});

const logger = createLogger({
  levels: config.syslog.levels,
  transports: [new transports.Console(options.console)],
  exitOnError: false,
});

module.exports = logger;
