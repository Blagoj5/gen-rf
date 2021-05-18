#!/usr/bin/env node

import path from 'path';
import { loadOptions } from './loaders';
import { GenRfOptions } from './types';
import {
  createStyleFile,
  createTestFile,
  creteJsFile,
  ensureDirectoryExistence,
  promptFileNameAndOutput,
} from './utils';

const run = async () => {
  const options: GenRfOptions = (await loadOptions()) as GenRfOptions;

  const { componentName, fileName, output } = await promptFileNameAndOutput(options);
  const fullFilesPath = path.resolve(options.rootDir, output);

  ensureDirectoryExistence(fullFilesPath);

  //   Create jsx or tsx
  creteJsFile({ fileName, fileType: options.type, componentName, out: fullFilesPath });

  //   Create spec or test
  if (options.test !== 'none')
    createTestFile({ fileName, fileType: options.type, componentName, out: fullFilesPath, testType: options.test });

  if (options.style !== 'none') createStyleFile({ fileName, out: fullFilesPath, styleType: options.style });

  process.exit(0);
};

run();
