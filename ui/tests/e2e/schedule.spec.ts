import {expect, test} from '@playwright/test';

test('should display the header', async ({page}) =>
    expect(page.getByTestId("page-header")).toHaveText('Schedule')
);

test('should not display "No schedules found."', async ({page}) => {
    // Navigate to the URL
    await page.goto('http://localhost:5173/schedule');

    // Check that the text "No schedules found." is NOT present on the page
    const textPresent = await page.locator('text=No schedules found.').count();
    expect(textPresent).toBe(0);
});