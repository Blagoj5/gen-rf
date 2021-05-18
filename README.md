# gen-rf

Generates jsx or tsx file together with test or styles files, all with predefined snippets.

Component name is validated before usage (example for file: primary-button, component will be called PrimaryButton).

## Usage

```
npx gen-rf
```

## CLI Options

If --file or --out not specified, user will be prompted every time for input

```
Usage: index [options]

Options:
  -V, --version           output the version number
  -g, --gen-cfg           generate config file if one doesn't exist (default: true)
  type                    file type: tsx/jsx (default: "tsx")
  -f, --file <type>       specify file name
  -cnf, --config <type>   specify path to config file (default: ".genrfrc.json")
  -o, --out <type>        specify output dir
  -tsf, --test <type>     specify suffix for the test files: none/spec/test (default: "spec")
  -style, --style <type>  specify whenever to genereate css/scss/sass/less file or not (default: "none")
  -h, --help              display help for command
```

## Config file

**Configuration file overrides cli commands/options**

**.genrfrc.json:**

```json
{
  "rootDir": "./",
  "type": "tsx",
  "test": "spec",
  "style": "none"
}
```

Just run npx gen-rf and configuration file will be auto generated depending on user's input

## package.json

npm

```
npm install gen-rf --save-dev
```

yarn

```
yarn add gen-rf -D
```

```json
{
  "scripts": {
    "gen-rf": "gen-rf"
  }
}
```

## Examples with options

```
npx gen-rf --tsx -o test -f secondary-button
```

test/secondary-button.tsx

```
import React from 'react'

interface SecondaryButtonProps {

}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({}) => {
    return ();
}
```

test/secondary-button.spec.ts

```
import { render } from "@testing-library/react";

import { SecondaryButton } from "./index";

describe("SecondaryButton component testing with testing-library", () => {
    const component = render(<SecondaryButton />);

    it("renders without crashing", () => {
        expect(component).toBeTruthy();
    });
});
```

## Config File Options

| Option  | Description                                                                                         |
| ------- | --------------------------------------------------------------------------------------------------- |
| rootDir | The root directory used for file creation                                                           |
| type    | Type for newly craeted files: .jsx\|.tsx                                                            |
| test    | The suffix that should be appended to the test file: .(test\|spec).(js\|ts) or none                 |
| test    | The suffix that should be appended to the style file: .(module\|none).(css\|scss\|less\|sass\|none) |
