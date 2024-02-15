

import chalk from "chalk";

/**
 * @typedef LogMessageSetting
 * @type {object}
 * @property {string} displayFormat
 * @property {{[key:number]:{override:boolean}}} groups
 */
const logMessageSetting = {
  displayFormat :
      "<% group.from(0) %> <% log.message %> <% group.from(0).to() %>",
  groups : {0 : {override : true}}
};

const logStatusSetting = {
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
    displayFormat : "[ <% log.callback %> ]",
    Promise : async function() { return "" }, // default false
  },
}

export class LoggerConfig {
  _logMessage = {};
  _status = {};

  constructor(configs = {logStatusSetting, logMessageSetting}) {
    // setting up logStatusSetting
    Object.entries(configs.logStatusSetting).forEach(([ name, config ]) => {
      if (config.group == undefined)
        throw new error("need to put Group property");
      if (config.level == undefined)
        throw new error("need to put Level property");
      if (config.colorCode == undefined)
        config.colorCode = chalk.white;
      if (config.dislayFormat == undefined)
        config.displayFormat = "[ <% log.name %> ]";
      config.name = name;
    })

    Object.assign(this._status, configs.logStatusSetting);

    // setting up logMessageSetting

    if (configs.logMessageSetting.displayFormat == undefined)
      configs.logMessageSetting.displayFormat = logMessageSetting.displayFormat;

    Object.assign(this._logMessage, configs.logMessageSetting);
  }

  get status() { return Object.entries(this._status) }
  get logMessage() { return this._logMessage };
}
