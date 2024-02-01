const operationType = Object.freeze({
  ALL: 0,
  ACTION: 1,
  ATTR: 2,
});
// temp start

//temp
//

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
  console.log('creating prototype', options?.type, options?.name);
  var method = {};

  console.log(options?.type);

  if (options?.type ^ operationType.ACTION) {
    console.log('action added');
    method = { ...methodStructure.action, ...method };
  }
  if (options?.type ^ operationType.ATTR) {
    console.log('attr added');
    method = { ...methodStructure.attr, ...method };
  }

  console.log('method', method);
  return method;
}

function createLogger(options) {
  return loggerFactory(options);
}

function createBuilder(self, options) {
  const builder = (...args) => {
    return args;
  };

  builder.type |= options.type;
  console.log('type added', builder.type);

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

Object.defineProperties(createLogger.prototype, createMethod({ type: operationType.ALL }));
const logger = createLogger();
console.log(logger.log.delay('test'));
// console.log(createMethod({ type: operationType.ALL }));
// console.log(loggerMethod);
