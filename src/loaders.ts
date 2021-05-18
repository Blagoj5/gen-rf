import { program } from 'commander';
import path from 'path';
import pckg from '../package.json';
import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';

// Set version
program.version(pckg.version);
program
  .option('-g, --gen-cfg', chalk.green("generate config file if one doesn't exist"), true)
  .option('type', chalk.green('file type: tsx/jsx'), 'tsx')
  .option('-f, --file <type>', chalk.green('specify file name'))
  .option('-cnf, --config <type>', chalk.green('specify path to config file'), '.genrfrc.json')
  .option('-o, --out <type>', chalk.green('specify output dir'))
  //   TODO: add the whole logic for these
  .option('-tsf, --test <type>', chalk.green('specify suffix for the test files: none/spec/test'), 'spec')
  .option(
    '-style, --style <type>',
    chalk.green('specify whenever to genereate css/scss/sass/less file or not'),
    'none'
  );

program.parse();

const options = program.opts();

export const loadOptions = async () => {
  // Update options object and returns response if config file is present
  if (readConfigFile()) return options;

  //   Don't genereate config file if gen-cfg is false, return default options
  if (!options.genCfg) {
    console.log(chalk.yellow('No .genrfrc.json config found, using options provided by the CLI and default options'));
    return options;
  }

  //   Genereate config file
  const { createConfigFile: toCreateConfigFile, configPath, ...configFileAnswers } = await askConfigFileQuestions();

  //   Whenever or not to create the config file
  if (toCreateConfigFile) createConfigFile(configPath, configFileAnswers);

  return { ...options, ...configFileAnswers };
};

function createConfigFile(configPath: string, answers: Record<string, any>) {
  const configCreationPath = path.resolve(
    __dirname,
    (configPath as string).endsWith('.json') ? configPath : configPath + './.genrfrc.json'
  );

  try {
    fs.writeFileSync(configCreationPath, JSON.stringify(answers));
  } catch (_) {
    console.log(
      chalk.red('There was a problem while creating config file! Check if config path exists: ', configCreationPath)
    );
    process.exit(1);
  }
}

function readConfigFile(relativeConfigPath: string = options.config) {
  // If config file exists
  const configPath = path.resolve(__dirname, relativeConfigPath);
  if (fs.existsSync(configPath)) {
    console.log(chalk.yellow('Reading config from ' + configPath));
    // Available options for config file: rootDir and type
    const configFileOptions = require(configPath);
    Object.assign(options, configFileOptions);
    return true;
  }

  return false;
}

function askConfigFileQuestions(): Record<string, any> {
  return new Promise((res) => {
    inquirer
      .prompt([
        {
          name: 'createConfigFile',
          type: 'confirm',
          message: 'Create .genrfrc.json config file?',
        },
        {
          name: 'configPath',
          type: 'input',
          message: 'The path for the config file',
          default: '.genrfrc.json',
          when: (previousAnswers) => previousAnswers.createConfigFile,
        },
        {
          name: 'rootDir',
          type: 'input',
          message: 'Root directory for the new generated files (--out config will be appended to the rootDir)',
          default: './',
          when: (previousAnswers) => previousAnswers.createConfigFile,
        },
        {
          name: 'type',
          type: 'list',
          message: 'File extension to be:',
          choices: ['tsx', 'jsx'],
        },
        {
          name: 'test',
          type: 'list',
          message: 'Generate test files:',
          choices: ['none', 'test', 'spec'],
        },
        {
          name: 'style',
          type: 'list',
          message: 'Generate style files with suffix:',
          choices: [
            'none',
            'css',
            'scss',
            'sass',
            'less',
            new inquirer.Separator(),
            'module.css',
            'module.scss',
            'module.sass',
            'module.less',
          ],
        },
        // {
        //   name: 'fileName',
        //   type: 'input',
        //   message: 'File name: ',
        //   default: 'index',
        // },
      ])
      .then((answers) => res(answers));
  });
}
