//@ts-check
import chalk from 'chalk';
/**
 * getting branch from github repo
 * @returns {Promise<string[]>}
 */
export async function getBranchList() {
  const headers = {
    'X-Github-Api-Version': '2022-11-28',
  };

  const response = await fetch(
    `https://api.github.com/repos/dennis0324/common-template/branches`,
    {
      method: 'GET',
      headers,
    }
  );

  /**
   * @type { {name:string,commit:{sha:string,url:string},protected:boolean}[] }
   */
  const nameList = await response.json();

  return nameList.map((branch) => branch.name);
}

export async function showBranchList() {
  const lists = await getBranchList();
  console.log(chalk.blue('[Template Downloader]') + '\n--list--');
  lists.forEach((list) => console.log(list));
}

/**
 * @param {number} arg1
 * @param {number} arg2
 * @param {number} arg3
 * @param {number} arg4
 */
export async function testing(arg1, arg2, arg3, arg4) {
  return {
    name: arg1,
    age: arg2,
    height: arg3,
    weight: arg4,
  };
}
