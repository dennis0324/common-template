// TODO: refactor all of this
//  ts-check
import chalk from "chalk";

/**
 * @typedef options
 * @type {object}
 * @property {number?} level
 *
 */

/**
 * @typedef AdditionalInfo
 * @type {object}
 * @property {number} type
 * @property {string} name
 *
 */

const operationType = Object.freeze({
  NONE : 0,
  ACTION : 1,
  ATTR : 2,
});

/**
 * {
 *  @property {function} log
 *  @property {function} debug
 *  @property {function} warn
 *  @property {function} error
 *  @property {function} delay
 * }
 */
const loggerMethod = Object.create(null);
loggerMethod.debug = {
  get() {
    const builder = createBuilder(this, {
      type : operationType.ACTION,
      name : "debug",
      level : 0,
    });
    Object.defineProperty(this, "debug", {value : builder});

    return builder;
  },
};

loggerMethod.log = {
  get() {
    const builder = createBuilder(this, {
      type : operationType.ACTION,
      name : "log",
      level : 1,
    });
    Object.defineProperty(this, "log", {value : builder});

    return builder;
  },
};

loggerMethod.warn = {
  get() {
    const builder = createBuilder(this, {
      type : operationType.ACTION,
      name : "warn",
      level : 2,
    });
    Object.defineProperty(this, "warn", {value : builder});
    return builder;
  },
};

loggerMethod.error = {
  get() {
    const builder = createBuilder(this, {
      type : operationType.ACTION,
      name : "error",
      level : 3,
    });
    Object.defineProperty(this, "error", {value : builder});
    return builder;
  },
};

const methodStructure = {
  get action() {
    return loggerMethod;
  },
  get attr() {
    const attr = Object.create(null);
    attr.delay = {
      get() {
        const builder = createBuilder(this, {
          type : operationType.ATTR,
          name : "delay",
        });
        Object.defineProperty(this, "delay", {value : builder});

        return builder;
      },
    };
    return attr;
  },
};

function createMethod(options) {
  var method = {};

  if (options?.type ^ operationType.ACTION) {
    method = {...methodStructure.action, ...method};
  }
  if (options?.type ^ operationType.ATTR) {
    method = {...methodStructure.attr, ...method};
  }

  return method;
}

/**
 * @param {options} options
 */
function createLogger(options) {
  return loggerFactory(options);
}

function delayLog(messageData, args) {
  this.startTime = Date.now();

  var resolve, reject;
  const dfd = new Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });

  dfd.then((time) => {
    displayLog(messageData, {sec : time / 1000});
  });

  this.done = function() {
    resolve(Date.now() - this.startTime);
  };
  this.fail = function() {
    reject();
  };
}

function checkFlag(cmp, src) {
  return (cmp & src) == src;
}

/**
 * @param {options} opts
 */
function delayFormatter(_, opts) {
  const sec = opts?.sec;
  if (sec == null || sec == undefined)
    return chalk.white.bgBlueBright(`[DELAY]`);
  else
    return chalk.white.bgBlueBright(`[DELAYED] ${sec}sec`);
}

function actionFormatter(messages, opts) {
  const displayString = messages.name.toUpperCase();
  if (messages.name === "debug")
    return chalk.white.bgGray(`${displayString}`);
  else if (messages.name === "log")
    return chalk.white(`${displayString}`);
  else if (messages.name === "warn")
    return chalk.black.bgYellowBright(`${displayString}`);
  else if (messages.name === "error")
    return chalk.white.bgRedBright(`${displayString}`);
}

/**
 * this function determine messageData is string or function and change to string
 * @param {object[]} message
 * @param {AdditionalInfo} additionInfo
 */
function displayLog(messages, additionInfo) {
  const displayString = [ messages.action, messages.message, ...messages.attr ];
  const arr = displayString.map((message) => {
    if (typeof message === "function") {
      return message(messages, additionInfo);
    }
    else
      return message;
  });

  console.log(arr.join(" "));
}

function applyColor(self, additionalInfo, ...args) {
  const builderSelf = {...self};
  self.type = 0;
  self.displayStr = [];
  const actionStr = builderSelf.displayStr[0];
  const attrStr = builderSelf.displayStr.slice(1);

  const messageFormat = {
    action : actionStr,
    message : args.join(" "),
    attr : attrStr,
    ...additionalInfo,
  };
  console.log(self.level, additionalInfo);
  console.log("builderSelf", builderSelf);

  if (checkFlag(builderSelf.type, operationType.ATTR | operationType.ACTION)) {
    if (builderSelf.level <= additionalInfo.level) {
      console.log("executing delay log")
      createLogger.type = 0;
      createLogger.displayStr = [];
      console.log(createLogger);
      return new delayLog(messageFormat);
    }
  }
  else {
    if (builderSelf.level <= additionalInfo.level) {
      console.log("printing log");
      displayLog(messageFormat);
    }
  }
}

/**
 * @param {object} self
 * @param {AdditionalInfo} additionalInfo
 */
function createBuilder(self, additionalInfo) {
  console.log(self);
  const builder = (...args) => applyColor(builder, additionalInfo, ...args);
  self.type |= additionalInfo.type;

  var message = null;
  if (checkFlag(additionalInfo.type, operationType.ATTR)) {
    message = delayFormatter; // delayFormatter
  }
  else if (checkFlag(additionalInfo.type, operationType.ACTION)) {
    message = actionFormatter; // actionFormatter
  }
  self.displayStr.splice(additionalInfo.type - 1, 0, message);

  builder.type = self.type;
  builder.displayStr = self.displayStr;
  builder.level = self.level;

  const proto = Object.defineProperties(() => {}, {
    ...createMethod(additionalInfo),
  });
  Object.setPrototypeOf(builder, proto);
  return builder;
}
Object.setPrototypeOf(createLogger.prototype, Function.prototype);

/**
 * @param {level?:number} options
 */
const loggerFactory = (options = {}) => {
  const level = options?.level ?? 1;
  const logger = (...strArgs) => strArgs.join(" ");

  // initailize valuable do not change in runtime
  logger.type = 0;
  logger.displayStr = [];
  logger.level = level;

  Object.setPrototypeOf(logger, createLogger.prototype);
  return logger;
};

Object.defineProperties(
    createLogger.prototype,
    createMethod({type : operationType.NONE}),
);
const logger = createLogger();

export const LogLevel = {
  DEBUG : 0,
  LOG : 1,
  WARN : 2,
  ERROR : 3,
};
export {createLogger};
export default logger;
