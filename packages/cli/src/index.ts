#!/usr/bin/env node
// src/index.ts
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { GenzLang, GenzSyntaxError, GenzRuntimeError } from 'genz-lang-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// Set up CLI info
program
  .name('genz')
  .description('Gen-Z Slang Lang - a browser-first toy language with Gen-Z slang keywords')
  .version('0.1.0');

// Run command
program
  .command('run')
  .description('Run a Gen-Z Slang Lang program')
  .argument('<file>', 'The .genz file to execute')
  .option('-d, --debug', 'Output debug information (tokens and AST)')
  .action(async (file, options) => {
    try {
      // Check if file exists
      try {
        await fs.access(file);
      } catch (err) {
        console.error(chalk.red(`🚫 File "${file}" does not exist. That's not bussin'.`));
        process.exit(1);
      }

      // Read file
      const source = await fs.readFile(file, 'utf8');
      
      console.log(chalk.yellow('🔥 Gen-Z Slang Lang Interpreter 🔥'));
      
      if (options.debug) {
        console.log(chalk.cyan('Code to execute:'));
        console.log(chalk.gray('------------------------------------------'));
        console.log(chalk.white(source));
        console.log(chalk.gray('------------------------------------------'));
      }
      
      // Create interpreter instance and execute
      const genzLang = new GenzLang();
      const output = genzLang.execute(source);
      
      console.log(chalk.green('✨ Output:'));
      output.forEach(line => console.log(chalk.white(line)));
      
      if (options.debug) {
        console.log(chalk.magenta('\n🔍 Debug mode enabled'));
        try {
          const ast = genzLang.parse(source);
          console.log(chalk.blue('AST:'), JSON.stringify(ast, null, 2));
        } catch (err) {
          console.log(chalk.red('Failed to parse for debug:'), err);
        }
      }
    } catch (err) {
      console.error(chalk.red(`💀 Error: ${err instanceof Error ? err.message : String(err)}`));
      process.exit(1);
    }
  });

// REPL command  
program
  .command('repl')
  .description('Start an interactive Gen-Z Slang Lang REPL')
  .action(() => {
    console.log(chalk.yellow('🔥 Gen-Z Slang Lang REPL 🔥'));
    console.log(chalk.cyan('Type Gen-Z code and see it execute. Use .exit or Ctrl+C to quit.'));
    
    const genzLang = new GenzLang();
    
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.green('genz> ')
    });

    rl.prompt();

    rl.on('line', (input) => {
      if (input.trim() === '.exit') {
        rl.close();
        return;
      }
      
      try {
        const output = genzLang.execute(input);
        output.forEach(line => console.log(chalk.white(line)));
      } catch (err) {
        console.error(chalk.red(`💀 Error: ${err instanceof Error ? err.message : String(err)}`));
      }
      
      rl.prompt();
    });

    rl.on('close', () => {
      console.log(chalk.cyan('\nStay bussin\'! ✌️'));
      process.exit(0);
    });
  });

program.parse(process.argv);
