import {expect, test} from "@playwright/test";

test('should display the header', async ({page}) => {
    await page.goto('http://localhost:5173/sessions');
    await expect(page.getByTestId("page-header")).toHaveText('Sessions')
});