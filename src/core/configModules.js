

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
  groups : {0 : {override : false}}
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
    displayFormat : "[ <% log.name %> ]",
    Promise : async function() { return "" }, // default false
  },
}

export class LoggerConfig {
  loggerConfig = {};
  statusConfig = {};

  constructor(configs = {logStatusSetting, logMessageSetting})
  {
    console.log("asfa");
    // setting up logStatusSetting
    Object.values(configs.logStatusSetting).forEach(config => {
      if (config.group == undefined)
        throw new error("need to put Group property");
      if (config.level == undefined)
        throw new error("need to put Level property");
      if (config.colorCode == undefined)
        Object.assgin(config.colorCode, {colorCode : chalk.white});
      if (config.dislayFormat != undefined)
        Object.assign(config.displayFormat,
                      {displayFormat : "[ <% log.name %>]"});
    })

    Object.assign(this.statusConfig, configs.logStatusSetting);

    // setting up logMessageSetting

    if (configs.logMessageSetting.displayFormat == undefined)
      configs.logMessageSetting.displayFormat = logMessageSetting.displayFormat;

    Object.assign(this.loggerConfig, configs.logMessageSetting);
  }

  // getStatusConfig() { return Object.entries(this.statusConfig) }
}
