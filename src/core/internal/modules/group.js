import {internalObject} from "../internalFunction";

/**
 * @typedef LogMessageSetting
 * @type {object}
 * @property {string} displayFormat
 * @property {{[key:number]:{override:boolean}}} groups
 */

class GroupModel extends internalObject {

  constructor() {}

  get_Group(lg) {}

  /**
   * @param {LogMessageSetting} lg
   * @param {{override:boolean}} opts
   */
  set_Group(lg, {override}) {}
}
