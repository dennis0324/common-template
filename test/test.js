const operationType = Object.freeze({
  NONE: 0,
  ACTION: 1,
  ATTR: 2,
});

const loggerMethod = Object.create(null);
loggerMethod.log = {
  get() {
    const builder = createBuilder(this, { type: operationType.ACTION, name: 'log' });
    Object.defineProperty(this, 'log', { value: builder });

    return builder;
  },
};

loggerMethod.debug = {
  get() {
    const builder = createBuilder(this, { type: operationType.ACTION });
    Object.defineProperty(this, 'debug', { value: builder });

    return builder;
  },
};

loggerMethod.warn = {
  get() {
    const builder = createBuilder(this, { type: operationType.ACTION });
    Object.defineProperty(this, 'warn', { value: builder });
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
        const builder = createBuilder(this, { type: operationType.ATTR });
        Object.defineProperty(this, 'delay', { value: builder });

        return builder;
      },
    };
    return attr;
  },
};

function createMethod(options) {
  var method = {};

  if (options?.type ^ operationType.ACTION) {
    method = { ...methodStructure.action, ...method };
  }
  if (options?.type ^ operationType.ATTR) {
    method = { ...methodStructure.attr, ...method };
  }

  return method;
}

function createLogger(options) {
  return loggerFactory(options);
}

function delayLog(...message) {
  this.startTime = Date.now();

  var resolve, reject;
  const dfd = new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });

  dfd.then((time) => console.log(`[delayed ${time / 1000}SEC]`, message.join(' ')));

  this.done = function () {
    resolve(Date.now() - this.startTime);
  };
  this.fail = function () {
    reject();
  };
}

function checkFlag(cmp, src) {
  console.log(cmp, src);
  return (cmp & src) == src;
}

function createBuilder(self, options) {
  console.log(self?.type);
  const builder = (...args) => {
    if (checkFlag(options.type, operationType.ACTION | operationType.ATTR)) {
      return new delayLog(args);
    }
    if (checkFlag(options.type, operationType.ATTR)) {
      console.log('[delay]', args.join(' '));
    }
    if (checkFlag(options.type, operationType.ACTION)) {
      console.log('action');
    }
  };

  builder.type |= options.type;

  const proto = Object.defineProperties(() => {}, {
    ...createMethod(options),
  });
  Object.setPrototypeOf(builder, proto);
  return builder;
}

Object.setPrototypeOf(createLogger.prototype, Function.prototype);

const loggerFactory = (options) => {
  const logger = (...strArgs) => strArgs.join(' ');
  Object.setPrototypeOf(logger, createLogger.prototype);
  return logger;
};

Object.defineProperties(createLogger.prototype, createMethod({ type: operationType.NONE }));
const logger = createLogger();

logger.delay.log('testing', 'hello2');

logger.delay('testing', 'hello');
