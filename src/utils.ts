import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { GenRfOptions } from './types';

export function promptFileNameAndOutput({
  rootDir,
  file,
  out,
}: GenRfOptions): Promise<{ fileName: string; componentName: string; output: string }> {
  return new Promise((res) => {
    const questions = [];
    if (!file)
      questions.push({
        type: 'input',
        message: 'Enter file name:',
        name: 'fileName',
        default: 'index',
      });

    if (!out)
      questions.push({
        type: 'input',
        message: `Enter output directory, (this will append to the specified rootDir) ${rootDir}/: `,
        name: 'output',
        default: '.',
      });

    if (questions.length === 0)
      return res({ output: '.', componentName: validateComponentName(file), fileName: validateFileName(file) });

    inquirer.prompt(questions).then((answers) =>
      res({
        fileName: validateFileName(answers.fileName || file),
        componentName: validateComponentName(answers.fileName || file),
        output: answers.output || out,
      })
    );
  });
}

// Remove any prefixes
export function validateFileName(fileName?: string) {
  return fileName ? fileName.replace(/\.(jsx|tsx)/gi, '') : 'index';
}

// filename: primary-button -> PrimaryButton
// filename: primary-imp-button -> PrimaryImpButton
export function validateComponentName(fileName?: string) {
  return fileName
    ? fileName
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('')
    : 'Index';
}

export function ensureDirectoryExistence(filePath = '.') {
  fs.mkdirSync(filePath, { recursive: true });
}

type FileCreationParameters = {
  fileName: string;
  componentName: string;
  out: string;
  fileType: GenRfOptions['type'];
};

export function creteJsFile({ componentName, fileName, fileType, out }: FileCreationParameters) {
  const filePath = path.resolve(out, fileName + `.${fileType}`);
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
}

export const createTestFile = ({
  componentName,
  fileName,
  out,
  fileType,
  testType,
}: FileCreationParameters & {
  testType: GenRfOptions['test'];
}) => {
  //   Write spec/test. file-name.(spec|test).(ts|js)
  const specPath = path.resolve(out, fileName + `.${testType}` + `.${fileType.slice(0, fileName.length)}`);
  console.log(chalk.yellow('Creating: ' + specPath));
  fs.writeFileSync(
    specPath,
    `import { render } from "@testing-library/react";

import { ${componentName} } from "./${fileName}.${fileType}";

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

export const createStyleFile = ({
  fileName,
  out,
  styleType,
}: Omit<FileCreationParameters, 'fileType' | 'componentName'> & {
  styleType: GenRfOptions['style'];
}) => {
  //   Write spec/test. file-name.(spec|test).(ts|js)
  const specPath = path.resolve(out, fileName + `.${styleType}`);
  console.log(chalk.yellow('Creating: ' + specPath));
  fs.writeFileSync(
    specPath,
    `.${fileName} {

}
    `
  );
  console.log(chalk.green('Created: ' + specPath));
};
