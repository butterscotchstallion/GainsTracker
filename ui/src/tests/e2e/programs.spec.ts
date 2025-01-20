import {expect, test} from "@playwright/test";

test('should display the header', async ({page}) => {
    await page.goto('/programs');
    await expect(page.getByTestId("page-header")).toHaveText('Programs');
});