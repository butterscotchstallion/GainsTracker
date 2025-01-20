import {expect, test} from "@playwright/test";

test('should display the header', async ({page}) => {
    await page.goto('http://localhost:5173/programs');
    await expect(page.getByTestId("page-header")).toHaveText('Programs');
});