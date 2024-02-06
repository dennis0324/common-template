// TODO: define message order that should be displayed
// also need to make setting for index that go fg or bg
// example: fg : 2 -> [action] [action] message [rest]

// TODO: make group of message should not be duplicated
// Printing message can be string or function

const MESSAGE_ORDER = Objet.freeze({
  'DEBUG' : 0,
  'LOG' : 0,
  'WARN' : 0,
  'ERROR' : 0,
  'DELAY' : 4,
});

function delayLog(messageData, args) {
  this.startTime = Date.now();

  var resolve, reject;
  const dfd = new Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });

  dfd.then((time) => {
    console.log("done");
  });

  this.done = function() {
    resolve(Date.now() - this.startTime);
  };
  this.fail = function() {
    reject();
  };
}

function createBuilder(attr) {
  const builder = (...args) => {
    console.log("outcome", attr);
    attr = 0;
    if (args.length > 0)
      return new delayLog(...args);
  };

  builder.level = attr;

  const proto = Object.defineProperties(() => {}, {
    ...ob,
  });
  Object.setPrototypeOf(builder, proto);
  return builder;
}
function createAttr(level) {
  if (level == undefined) {
    level = 0;
  }
  else
    level = level + 1;
  return level;
}

const ob = Object.create(null);
ob.build = {
  get() {
    const {level} = this;
    const modifiedAttr = createAttr(level);
    const builder = createBuilder(modifiedAttr);
    Object.defineProperty(this, "build", {value : builder});
    return builder;
  }
};

function createLoop() {
  const loop = createBuilder();
  return loop
}

const loop = createLoop();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const a = loop.build.build("testing");
await sleep(1000);
loop.build.build.build.build.build()
a.done();
