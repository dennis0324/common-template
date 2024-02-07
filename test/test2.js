// TODO: define message order that should be displayed
// also need to make setting for index that go fg or bg
// example: fg : 2 -> [action] [action] message [rest]

// TODO: make group of message should not be duplicated
// Printing message can be string or function

import chalk from 'chalk';

/**
 * @typedef DefinationElement
 * @type {Object}
 * @property {number} group
 * @property {number} level
 * @property {import('chalk').ChalkInstance} colorCodegroup
 *
 */

/**
 * @typedef DefinationOptions
 * @type {object}
 * @property {Object.<string, DefinationElement>} defaultDefination
 */

/**
 * @type {Definations} definations
 */
const defaultDefination = {
  debug : {
    group : 0,
    level : 0,
    colorCode : chalk.white.bgGray,
  },
  log : {
    group : 0,
    level : 1,
    colorCode : chalk.white,
  },
  warn : {
    group : 0,
    level : 2,
    colorCode : chalk.black.bgYellowBright,
  },
  error : {
    group : 0,
    level : 3,
    colorCode : chalk.white.bgRedBright,
  },
  delay : {
    group : 4,
    level : 9999,
    colorColde : chalk.white.bgBlueBright,
  }
};

const defaultGroup = {
  locations : {
    fg : [ 0 ],
  }
};

export const defaultOpts = {
  defaultGroup,
  defaultDefination
};

const MESSAGE_ORDER = Object.freeze({
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

function createBuilder(loggerSettings, msgData, decoratorSettings) {
  const builder = (...args) => {
    console.log("outcome", msgData);
    const fgString = loggerSettings.locations.fg.map(index => msgData.decorators[index]);
    var bgString = null;
    if (loggerSettings.locations?.bg == undefined) {
      bgString = Object.entries(msgData.decorators).filter(([ index, decorator ]) => loggerSettings.locations.fg.includes(index));
    }
    else
      bgString = loggerSettings.locations.bg.map(index => msgData.decorators[index]);
    console.log(fgString.join(' '), args.join(' '), bgString.join(' '))

    msgData.level = 0;
    // if (args.length > 0)
    //   return new delayLog(...args);
  };

  builder.level = msgData?.level;
  builder.decorators = msgData?.decorators;
  builder.loggerSettings = loggerSettings;

  const proto = Object.defineProperties(() => {}, {
    ...ob,
  });
  Object.setPrototypeOf(builder, proto);
  return builder;
}

/**
 *
 */
function createAttr({level, decorators}, decoratorSetting) {
  if (level == undefined) {
    level = 0;
    decorators = {};
  }
  level = level + 1;
  decorators[decoratorSetting.group] = decoratorSetting.colorCode(`[${decoratorSetting.name}]`);
  // need to add decorator and decorators
  return {
    level,
    decorators
  };
}

const ob = Object.create(null);

/**
 * @param {@param {DefinationOptions} ops}
 */
function initializeSetting(ops) {
  console.log("ops", ops);
  const definations = Object.entries(ops.defaultDefination);

  definations.forEach(([ definationName, element ]) => {
    ob[definationName] = {
      get() {
        const {level, decorators, loggerSettings} = this;
        console.log("decorators", level, decorators);
        element.name = definationName;
        // attribute is data for message that will be printed
        const modifiedAttr = createAttr({level, decorators}, element);
        console.log("modifiedAttr", modifiedAttr, "\n");
        const builder = createBuilder(loggerSettings, modifiedAttr, element);
        Object.defineProperty(this, definationName, {value : builder});
        return builder;
      }
    }
  })
}

function createLoop(opts = defaultOpts) {
  initializeSetting(opts)
  const loop = createBuilder();
  loop.loggerSettings = opts.defaultGroup;
  return loop
}

const loop = createLoop();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// const a = loop.debug.debug("testing");
// loop.debug.log.warn.error("testing error");
// loop.log.log("test log");
// loop.log.warn("test warn");
// loop.error.debug("test debug");
// await sleep(1000);
// loop.build.build.build.build.build()
// a.done();
//
