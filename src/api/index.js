//@ts-check
import chalk from 'chalk';
import { sh } from '../common/common.js';
import path from 'path';

const gitRepo = 'dennis0324/common-template';

/**
 * getting branch from github repo
 * @returns {Promise<string[]>}
 */
export async function getBranchList() {
  const headers = {
    'X-Github-Api-Version': '2022-11-28',
  };

  const response = await fetch(`https://api.github.com/repos/${gitRepo}/branches`, {
    method: 'GET',
    headers,
  });

  /**
   * @type { {name:string,commit:{sha:string,url:string},protected:boolean}[] }
   */
  const nameList = await response.json();

  return nameList.map((branch) => branch.name).filter((branch) => branch !== 'main');
}

export async function showBranchList() {
  const lists = await getBranchList();
  console.log(chalk.blue('[Template Downloader]') + '\n--list--');
  lists.forEach((list) => console.log(list));
}

export const sys = {
  /**
   * @param {Function} resolve
   * @param {[string,string,string]} args
   */
  mv: async function mvName(resolve, [path, fromName, toName]) {
    await sh(`mv ${path}/${fromName} ${path}/${toName}`);
    resolve('command :', `mv ${path}/${fromName} ${path}/${toName}`);
  },
  /**
   * @param {Function} resolve
   * @param {[string,string]} flag
   */
  rm: async function (resolve, [flag, ...pathArr]) {
    await sh(`rm ${flag} ${path.join(...pathArr)}`);
    resolve('command :', `rm ${flag} ${path.join(...pathArr)}`);
  },
};

export const git = {
  checkout: async function (resolve, [branch, ...pathArr]) {
    await sh(`git -C ${path.join(...pathArr)} checkout ${branch}`);
    resolve(`git -C ${path.join(...pathArr)} checkout ${branch}`);
  },
  /**
   * @param {Function} resolve
   * @parm
   */
  init: async function (resolve, [...pathArr]) {
    await sh(`git init ${path.join(...pathArr)}`);
    resolve('command :', `git init ${path.join(...pathArr)}`);
  },

  /**
   * @param {Function} resolve
   * @param {[string,string]} path
   * @returns Promise<void>
   */
  clone: async function (resolve, [path, name]) {
    await sh(`git clone https://github.com/${gitRepo} ${path}/${name}`);
    resolve('command :', `git clone https://github.com/${gitRepo} ${path}/${name}`);
  },
};
