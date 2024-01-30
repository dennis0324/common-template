import { exec } from 'child_process';
import { createSpinner } from 'nanospinner';
import { logger } from './logger.js';
// import { debuglog } from "util";

/**
 * @param {string} cmd
 */
export async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve({ stdout, stderr });
    });
  });
}

/**
 * @param {string} name
 * @param {Function} runFunc
 * @param {...string[]} args
 */
export async function startSpinner(name, runFunc, ...args) {
  const spinner = createSpinner(name);

  logger.debug('running command :', runFunc.name);
  let waitRunFunc = new Promise((resolve, reject) => {
    try {
      runFunc(resolve, args);
    } catch (exception) {
      reject(exception);
    }
  });

  var debugLog = '';
  spinner.start();
  try {
    if (runFunc) {
      debugLog = await waitRunFunc;
    } else spinner.error('Unknown Function');
    spinner.success();
    if (debugLog) logger.debug('run command :', debugLog);
    logger.debug('ending command :', runFunc.name);
  } catch (exception) {
    spinner.error(exception);
  }
}
