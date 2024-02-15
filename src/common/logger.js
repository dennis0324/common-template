import chalk from "chalk";
import _ from "lodash";

import {LoggerConfig} from '../core/configModules.js'

/**
 * @typedef DefinationElement
 * @type {Object}
 * @property {number} group
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
// WARN: not quite sure what should i put in the parameter
function messageDisplayFormat(self, loggerConfig) {}

function formatStatus(self) { console.log(self.finalDisplay); }

// log.name:
// messageDisplayFormat it will return logger.name(default: none)
// statusDisplayFortmat: return status.name( default: statusname, callbackExist:
// return promise and return done,and reject)
function displayMessage(self, config, ...args) {
  console.log("outcome", self);
  formatStatus(self)
  // messageDisplayFormat(self, self.loggerConfig);

  // need tot format decorators first then format displayFormat
}

function createBuilderOption(self, config, msgData) {
  config = config || {};
  if (config?.finalDisplay == undefined) {
    self.finalDisplay = {};
    const groupsConfig = self.config.logMessage.groups;
  }

  self.finalDisplay = {...msgData?.finalDisplay }
}

/**
 *
 */
function createBuilder(config, msgData) {
  const builder = (...args) =>
      displayMessage(builder, config, msgData, ...args);
  if (process.env.DEBUG)
    console.log("creating Builder...");

  // need to make custom proerty dynamically
  builder.config = config;
  createBuilderOption(builder, config, msgData);

  const proto = Object.defineProperties(() => {}, {
    ...ob,
  });
  Object.setPrototypeOf(builder, proto);
  return builder;
}

/**
 *
 */
function createMsgData(finalDisplay,
                       {groupsConfig, definationName, defination}) {
  console.log("creatingMsgData", finalDisplay);
  finalDisplay = _.cloneDeep(finalDisplay);

  finalDisplay[defination.group] ??= [];
  if (groupsConfig.groups[defination.group]?.override)
    finalDisplay[defination.group][0] = defination;
  else
    finalDisplay[defination.group].push(defination);

  console.log("createMsgData: msgData:", finalDisplay);
  // finalDisplay[defination.group]
  // need to add decorator and decorators
  return {finalDisplay};
}

const ob = Object.create(null);

/**
 * @param {@param {DefinationOptions} ops}
 */
function initializeSetting(configModule) {
  const definations = Object.entries(configModule.status);

  definations.forEach(([ _, [ definationName, defination ] ]) => {
    ob[definationName] = {
      get() {
        if (process.env.DEBUG)
          console.log("loading property: ", definationName)
          const {callback, finalDisplay, config} = this;
        // atte ribute is data for message that will be printed
        const groupsConfig = configModule.logMessage;
        const modifiedMsgData = createMsgData(
            finalDisplay,
            {groupsConfig, definationName, defination},
        );
        const builder = createBuilder(config, modifiedMsgData);
        Object.defineProperty(this, definationName, {value : builder});
        return builder;
      },
    };
  });
}

/**
 * @param {configModules} configModule
 */
function createLoop(configModule) {
  initializeSetting(configModule);
  // loop.loggerSettings = opts.defaultGroup;
  // configModule에서 설정 값 빼서 넣기
  const loop = createBuilder(configModule);
  // loop.config = configModule;
  return loop;
}

// const logger = createLoop();
export {createLoop};

// TODO: get all of the promise in arr and get on done()
