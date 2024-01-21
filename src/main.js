#!/usr/bin/env node

import { Command } from 'commander';
import { showBranchList } from './api/index.js';

const program = new Command();

program
  .option('-l, --list', 'list of template')

program.parse(process.argv);

const options = program.opts();
if (options.list) {
  showBranchList();
}
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType}`);


