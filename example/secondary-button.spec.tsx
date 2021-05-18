import { render } from "@testing-library/react";

import { SecondaryButton } from "./index";

describe("SecondaryButton component testing with testing-library", () => {
    const component = render(<SecondaryButton />);

    it("renders without crashing", () => {
        expect(component).toBeTruthy();
    });
});
    