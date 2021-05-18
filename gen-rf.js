#!/usr/bin/env node

const { program } = require('commander');
const package = require('./package.json');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Set version
program.version(package.version);
program
  .option('-t, --tsx', chalk.green('generate tsx file with spec file'))
  .option('-j, --jsx', chalk.green('generate jsx file with spec file'))
  .option('-f, --file <type>', chalk.green('specify file name'), 'index')
  .option('-o, --out <type>', chalk.green('specify output dir'), '.');

program.parse();
const options = program.opts();

function readFileName() {
  return new Promise((res) => {
    rl.question(chalk.green('Enter filename: '), (fileName) => {
      rl.close();

      res(validateFileName(fileName));
    });
  });
}

// Remove any prefixes
function validateFileName(fileName) {
  return fileName ? fileName.replace(/\.(jsx|tsx)/gi, '') : 'index';
}

// filename: primary-button -> PrimaryButton
// filename: primary-imp-button -> PrimaryImpButton
function validateComponentName(fileName) {
  return fileName
    ? fileName
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('')
    : 'Index';
}

function ensureDirectoryExistence(filePath = '.') {
  fs.mkdirSync(filePath, { recursive: true });
}

const writeToFiles = (fileName, fileType, componentName) => {
  const filePath = path.resolve(options.out, fileName + fileType);
  console.log(chalk.yellow('Creating: ' + filePath));
  fs.writeFileSync(
    filePath,
    `import React from 'react'

interface ${componentName}Props {

}

export const ${componentName}: React.FC<${componentName}Props> = ({}) => {
    return ();
} 
  `
  );
  console.log(chalk.green('Created: ' + filePath));

  //   Write spec/test. file-name.spec.ts(js)
  const specPath = path.resolve(options.out, fileName + '.spec' + fileType.slice(0, fileName.length));
  console.log(chalk.yellow('Creating: ' + specPath));
  fs.writeFileSync(
    specPath,
    `import { render } from "@testing-library/react";

import { ${componentName} } from "./index";

describe("${componentName} component testing with testing-library", () => {
    const component = render(<${componentName} />);

    it("renders without crashing", () => {
        expect(component).toBeTruthy();
    });
});
    `
  );
  console.log(chalk.green('Created: ' + specPath));
};

const run = async () => {
  const fileName = options.file || (await readFileName());
  const componentName = validateComponentName(fileName);

  // Default is tsx
  let fileType = '.tsx';
  if (options.jsx) fileType = '.jsx';

  ensureDirectoryExistence(options.out);

  //   Write jsx or tsx
  writeToFiles(fileName, fileType, componentName);
  process.exit(1);
};

run();
