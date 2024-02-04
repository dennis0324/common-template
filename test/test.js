import chalk from "chalk";

const operationType = Object.freeze({
  NONE : 0,
  ACTION : 1,
  ATTR : 2,
});

const loggerMethod = Object.create(null);
loggerMethod.log = {
  get() {
    const builder = createBuilder(this, {
      type : operationType.ACTION,
      name : "log",
    });
    Object.defineProperty(this, "log", {value : builder});

    return builder;
  },
};

loggerMethod.debug = {
  get() {
    const builder = createBuilder(this, {
      type : operationType.ACTION,
      name : "debug",
    });
    Object.defineProperty(this, "debug", {value : builder});

    return builder;
  },
};

loggerMethod.warn = {
  get() {
    const builder = createBuilder(this, {
      type : operationType.ACTION,
      name : "warn",
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

function createLogger(options) {
  return loggerFactory(options);
}

function delayLog(messageData, message) {
  this.startTime = Date.now();

  var resolve, reject;
  const dfd = new Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });

  dfd.then((time) => {
    const actionStr = messageData[0];
    const attrStr = messageData.slice(1);
    console.log(actionStr, message.join(" "), attrStr.join(" "));
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

function createBuilder(self, options) {
  console.log("createBuilder", self, options);
  const builder = (...args) => {
    // self.displayStr[MessageOrder.MESSAGE] = args.join(' ');

    // display the message
    // const arr = Object.entries(self.displayStr);
    // arr.sort((a, b) => a[0] - b[0]);
    // console.log(arr.map((element) => element[1]).join(' '));
    const actionStr = self.displayStr[0];
    const attrStr = self.displayStr.slice(1);

    if (checkFlag(self.type, operationType.ATTR | operationType.ACTION)) {
      return new delayLog(self.displayStr, args);
    }
    else {
      console.log(actionStr, args.join(" "), attrStr.join(" "));
    }

    self.displayStr = [];
    self.type = 0;
  };

  self.type |= options.type;

  var message = null;
  if (checkFlag(options.type, operationType.ATTR)) {
    message = chalk.white.bgBlueBright("[DELAY]");
  }
  else if (checkFlag(options.type, operationType.ACTION)) {
    message = chalk.black.bgRedBright(`[${options.name.toUpperCase()}]`);
  }
  self.displayStr.splice(options.type - 1, 0, message);
  console.log(self.displayStr);
  builder.type = self.type;
  builder.displayStr = self.displayStr;

  const proto = Object.defineProperties(() => {}, {
    ...createMethod(options),
  });
  Object.setPrototypeOf(builder, proto);
  return builder;
}
Object.setPrototypeOf(createLogger.prototype, Function.prototype);

const loggerFactory = (options) => {
  const logger = (...strArgs) => strArgs.join(" ");

  logger.type = 0;
  logger.displayStr = [];

  Object.setPrototypeOf(logger, createLogger.prototype);
  return logger;
};

Object.defineProperties(
    createLogger.prototype,
    createMethod({type : operationType.NONE}),
);
const logger = createLogger();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const a = logger.delay.log("testing");
await sleep(1000);
a.done();
