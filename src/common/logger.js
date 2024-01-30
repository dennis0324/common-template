import chalk from 'chalk';
import { ObjectFlags } from 'typescript';

export const logger = {
  delay: function () {
    this.displayStr = '';
    this.displayStr = chalk.white.bgBlueBright('[DELAY]');
    return this;
  },
  /**
   * @param {...string} str
   */
  debug: function (...str) {
    if (process.env['LOG_LEVEL'] > 0) return;
    console.log(chalk.white.bgGray('[DEBUG]'), ...str, this.displayStr);
  },
  /**
   * @param {...string} str
   */
  log: function (...str) {
    if (process.env['LOG_LEVEL'] > 1) return;
    console.log(chalk.white('[LOG]'), ...str, this.displayStr);
  },
  /**
   * @param {...string} str
   */
  warn: function (...str) {
    if (process.env['LOG_LEVEL'] > 2) return;
    console.log(chalk.black.bgYellowBright('[WARN]'), ...str, this.displayStr);
  },
  /**
   * @param {...string} str
   */
  error: function (...str) {
    if (process.env['LOG_LEVEL'] > 3) return;
    console.log(chalk.white.bgRedBright('[ERROR]'), ...str, this.displayStr);
  },
};
