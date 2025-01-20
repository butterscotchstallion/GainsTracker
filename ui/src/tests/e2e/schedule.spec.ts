import {expect, test} from '@playwright/test';

test('should display the workout cards', async ({page}) => {
    await page.goto('/schedule');
    const cardNumbers: number[] = [0, 1, 2];
    for (const cardNumber of cardNumbers) {
        await expect(page.getByTestId("schedule-card-" + cardNumber)).toBeVisible();
    }
});

test('should display the header', async ({page}) => {
    await page.goto('/schedule');
    await expect(page.getByTestId("page-header")).toHaveText('Schedule')
});

test('should not display "No schedules found."', async ({page}) => {
    // Navigate to the URL
    await page.goto('/schedule');

    // Check that the text "No schedules found." is NOT present on the page
    const textPresent = await page.locator('text=No schedules found.').count();
    expect(textPresent).toBe(0);
});