#!/usr/bin/env node

import { Command } from 'commander';
import { getBranchList, showBranchList, sys, git } from './api/index.js';
import { startSpinner } from './common/common.js';
import select from '@inquirer/select';
import { input } from '@inquirer/prompts';
import { logger } from './common/logger.js';

const program = new Command();

program
  .option('-l, --list', 'list of template')
  .option('-t, --template', 'download template')
  .option('-d,--debug', 'debug');

program.parse(process.argv);

const options = program.opts();
if (options.list) {
  showBranchList();
}
process.env['LOG_LEVEL'] = 1;
if (options.debug) process.env['LOG_LEVEL'] = 0;

if (options.template) {
  const branchLists = await getBranchList();
  const choices = branchLists.map((branch) => ({
    name: branch,
    value: branch,
  }));
  const branchType = await select({
    message: 'Select a template',
    choices: choices,
  });
  const nameFolder = await input({
    message: 'Enter your folder name:',
    default: 'newProject',
  });

  logger.debug('selected :', branchType, nameFolder);

  await startSpinner('Downloading Template...', git.clone, process.cwd(), branchType);
  await startSpinner('Changing branch...', git.checkout, branchType, process.cwd(), branchType); // 브랜치 변경 checkout
  await startSpinner('Removing dotgit directory...', sys.rm, '-rf', process.cwd(), branchType, '.git');
  await startSpinner('Initializing git...', git.init, process.cwd(), branchType);
  await startSpinner('Changing Name...', sys.mv, process.cwd(), branchType, nameFolder);
}
