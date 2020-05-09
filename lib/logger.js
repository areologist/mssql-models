const chalk = require('chalk');
const head = require('lodash/head');
const tail = require('lodash/tail');

const debug = s => `🤓 ${chalk.magenta('[DEBUG]:', s)}`;
const info = s => `   ${chalk.cyan('[INFO]: ') + s}`;
const warn = s => `🧐  ${chalk.yellow('[WARN]: ', s)}`;
const error = s => `😨 ${chalk.red('[ERROR]:', s)}`;
const fatal = s => `😵 ${chalk.bgRed('[FATAL]:', s)}`;

const log = (format, args) => console.log(format(head(args)), ...tail(args));

module.exports = {
  debug: (...args) => log(debug, args),
  info: (...args) => log(info, args),
  warn: (...args) => log(warn, args),
  error: (...args) => log(error, args),
  fatal: (...args) => log(fatal, args),
  json: (...args) => log(debug, ['JSON', JSON.stringify(head(args)), tail(args)]),
};
