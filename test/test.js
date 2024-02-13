import chalk from "chalk";

import {createLoop} from "../src/common/logger.js";
import {LoggerConfig} from "../src/core/configModules.js";

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// const log = createLogger();
// const a = log.delay.log("testing");
// console.log(log);

// const a = logger.delay.log("testing");
// log.error("testing error");
// log.log("testing log
// log.warn("testing warn");
// log.debug("testing debug");
// await sleep(1000);
// a.done();
// chalk.blue("hello");
// console.log(chalk);
// console.log(chalk.blue);

process.env.DEBUG = true;
const a = new LoggerConfig();
console.log('a', a);
const logger = createLoop(a);
console.log('asdf');
logger.log.log("testing log ");

// - [ ] display log with config setting
// - [ ] create internal function for eval function
// - [ ] attach to eval function with format
