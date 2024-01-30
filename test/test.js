import chalk from 'chalk';
const style = Object.create(null);
style.delay = {
  get() {
    const builder = createBuilder();
    Object.defineProperty(this, 'deplay', { value: builder });

    return builder;
    // const logger = createLogger();
  },
};

const proto = Object.defineProperties(() => {}, {
  ...style,
});

function createBuilder() {
  const builder = (...args) => {
    return args;
  };
  Object.setPrototypeOf(builder, proto);
  return builder;
}

function createLogger(options) {
  return loggerFactory(options);
}
Object.setPrototypeOf(createLogger.prototype, Function.prototype);

const loggerFactory = (options) => {
  const logger = (...strArgs) => strArgs.join(' ');
  Object.setPrototypeOf(logger, createLogger.prototype);
  return logger;
};

Object.defineProperties(createLogger.prototype, style);
const logger = createLogger();

console.log(chalk.blue);
console.log(logger.delay('hello', 'world'));
