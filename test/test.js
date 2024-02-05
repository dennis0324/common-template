import {createLogger,
        LogLevel} from "../src/common/logger.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = createLogger({level : LogLevel.DEBUG});
const a = log.delay.log("testing");
// const a = logger.delay.log("testing");
log.error("testing error");
log.log("testing log");
log.warn("testing warn");
log.debug("testing debug");
await sleep(1000);
a.done();
