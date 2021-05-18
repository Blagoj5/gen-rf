# gen-rf

Generates jsx or tsx file together with spec(test) file with a predefined snippet.

Component name is validated before usage (example for file: primary-button, component will be called PrimaryButton).

## Usage

```
npx gen-rf
```

## Options

If --jsx and --tsx is ommited, the default is **tsx**  
If --file is not specified, the user will be **prompted** to enter file name

```
-V, --version           output the version number
-t, --tsx               generate tsx file with spec file
-j, --jsx               generate jsx file with spec file
-f, --file <type>       specify file name (default: "index")
-o, --out <type>        specify output dir (default: ".")
-h, --help              display help for command
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
