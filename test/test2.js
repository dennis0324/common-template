// TODO: define message order that should be displayed
// also need to make setting for index that go fg or bg
// example: fg : 2 -> [action] [action] message [rest]

// TODO: make group of message should not be duplicated
// Printing message can be string or function

import chalk from "chalk";

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
// additional need to make config class for logger to manage easy
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
    group : 1,
    level : 9999,
    colorCode : chalk.white.bgBlueBright,
    displayFormat : "[ <% log.name %> ]",
    Promise : function() { return "" }, // default false
  },
};

const defaultGroup = {
  locations : {
    fg : [ 0 ],
  },
};

export const defaultOpts = {
  defaultGroup,
  defaultDefination,
};

// basic format convertor
/**
 * this function will convert decorators to string
 * @param {...any} args - this is for message input that will be printed
 */
function formatter(self, decorators, ...args)
{
  var format = self.loggerSettings.displayFormat;

  const matchFunction =
      format.match(/<%(.*?)%>/g).map((str) => str.replace(/(<%)|(%>)/g, ""));
  console.log(matchFunction);
  return format;
}

// _format method should have three parameter self, decorator, ...args
// regex and funcition should define

// WARN: not quite sure what should i put in the parameter
function statusFormat(self, decorator)
{
  console.log("decorator", decorator);
  return "name";
}

function dateFormat(self, decorator, args) { return args; }
function messageFormat(self, decorator, ...args) { return args.join(" "); }
function fgFormat(self, decorator)
{
  if (decorator)
    return "";
  const fg = self.loggerSettings.locations.fg.map(
      (index) => self.decorators[index],
  );
  console.log("fg", fg);
  return fg.map((decorator) => {
    console.log(decorator.fgFormat);
    console.log("asdf", formatter(self, decorator.fgFormat));
  });
}

// formatter should accept two ways
// 1. formatter(self)
// 2. formatter(self, decorator) -> this should not use bg and fg
//
function displayMessage(self, loggerSettings, ...args)
{
  console.log("outcome", self);
  formatter(self);

  // need tot format decorators first then format displayFormat
}

function createBuilder(loggerSettings, msgData, decoratorSettings)
{
  const builder = (...args) => displayMessage(builder, loggerSettings, ...args);

  // need to make custom proerty dynamically
  builder.level = msgData?.level;
  builder.decorators = {...msgData?.decorators};
  builder.loggerSettings = loggerSettings;
  builder.isPromise = msgData?.isPromise;

  const proto = Object.defineProperties(() => {}, {
    ...ob,
  });
  Object.setPrototypeOf(builder, proto);
  return builder;
}

/**
 *
 */
function createAttr({level, decorators, isPromise}, decoratorSetting)
{
  if (level == undefined) {
    level = 0;
    decorators = {};
    isPromise = false;
  }
  level = level + 1;

  decorators[decoratorSetting.group] = decoratorSetting;

  if (decoratorSetting.isPromise)
    isPromise = true;
  // need to add decorator and decorators
  return {level, decorators, isPromise};
}

const ob = Object.create(null);

/**
 * @param {@param {DefinationOptions} ops}
 */
function initializeSetting(ops)
{
  // property checking state
  // TODO: need to simplify this
  Object.keys(ops.defaultDefination).forEach((key) => {
    const config = ops.defaultDefination[key];
    if (config.group == undefined)
      throw new Error("group is not defined");
    if (config.level == undefined)
      throw new Error("level is not defined");
    if (config.colorCode == undefined)
      throw new Error("colorCode is not defined");
    if (config.isPromise == undefined)
      config.isPromise = false;
    if (config.bgFormat == undefined)
      config.displayFormat = "[<% log.name %>]";

    ops.defaultDefination[key];
  });

  ops.defaultGroup.displayFormat =
      ops.defaultGroup.displayFormat ?? "<%fg%> <%message%> <%bg%>";
  console.log("ops", ops);
  const definations = Object.entries(ops.defaultDefination);

  definations.forEach(([ definationName, element ]) => {
    ob[definationName] = {
      get() {
        const {level, decorators, loggerSettings, isPromise} = this;
        element.name = definationName;
        // atte ribute is data for message that will be printed
        const copyDecorators = {...decorators};
        const modifiedAttr = createAttr(
            {level, decorators : copyDecorators, isPromise},
            element,
        );
        console.log("modifiedAttr", modifiedAttr, "\n");
        const builder = createBuilder(loggerSettings, modifiedAttr, element);
        Object.defineProperty(this, definationName, {value : builder});
        return builder;
      },
    };
  });
}

function createLoop(opts = defaultOpts)
{
  initializeSetting(opts);
  const loop = createBuilder();
  loop.loggerSettings = opts.defaultGroup;
  return loop;
}

const loop = createLoop();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

loop.log("asfd");
// loop.log("hello");
// const a = loop.debug.debug("testing");
// loop.debug.log.warn.error("testing error");
// loop.debug.log("test log");
// loop.log.warn("test warn");
// loop.error.debug("test debug");
// const a = loop.delay.debug("test delay");
// a.done();
// await sleep(1000);
// loop.build.build.build.build.build()
// a.done();
//
