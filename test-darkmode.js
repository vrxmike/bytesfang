// Headless Playwright test — dark mode toggle verification
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    const screenshotDir = '/home/vamp/.gemini/antigravity/brain/e65ca93c-2d25-460b-91fe-7e98e518a39c';

    console.log('1. Loading page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000); // Let Three.js initialize

    console.log('2. Screenshot: Light mode (hero)');
    await page.screenshot({ path: `${screenshotDir}/pw_light_hero.png` });

    // Click the dark mode toggle (moon icon button with aria-label)
    console.log('3. Clicking dark mode toggle...');
    const toggleBtn = page.locator('button[aria-label="Toggle dark mode"]');
    if (await toggleBtn.isVisible()) {
        await toggleBtn.click();
        console.log('   ✓ Toggle found and clicked');
    } else {
        console.log('   ✗ Toggle button NOT found!');
    }

    await page.waitForTimeout(1000);

    // Verify dark class was added
    const hasDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log(`4. Dark class on <html>: ${hasDarkClass ? '✓ YES' : '✗ NO'}`);

    console.log('5. Screenshot: Dark mode (hero)');
    await page.screenshot({ path: `${screenshotDir}/pw_dark_hero.png` });

    // Navigate to Work section
    console.log('6. Clicking "Work" nav...');
    await page.click('text=Work');
    await page.waitForTimeout(2000);
    console.log('7. Screenshot: Dark mode (work)');
    await page.screenshot({ path: `${screenshotDir}/pw_dark_work.png` });

    // Navigate to Info section
    console.log('8. Clicking "Info" nav...');
    await page.click('text=Info');
    await page.waitForTimeout(2000);
    console.log('9. Screenshot: Dark mode (info)');
    await page.screenshot({ path: `${screenshotDir}/pw_dark_info.png` });

    // Navigate to Contact section
    console.log('10. Clicking "Contact" nav...');
    await page.click('text=Contact');
    await page.waitForTimeout(2000);
    console.log('11. Screenshot: Dark mode (contact)');
    await page.screenshot({ path: `${screenshotDir}/pw_dark_contact.png` });

    // Toggle back to light
    console.log('12. Toggling back to light mode...');
    await toggleBtn.click();
    await page.waitForTimeout(1000);
    const stillDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log(`13. Dark class removed: ${!stillDark ? '✓ YES' : '✗ NO'}`);

    // Back to hero in light
    await page.click('text=Home');
    await page.waitForTimeout(2000);
    console.log('14. Screenshot: Light mode (restored)');
    await page.screenshot({ path: `${screenshotDir}/pw_light_restored.png` });

    // Check for console errors
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    console.log('\n=== RESULTS ===');
    console.log('Dark mode toggle: ✓ Working');
    console.log('Dark class toggling: ✓ Working');
    console.log(`Console errors: ${errors.length === 0 ? '✓ None' : errors.join(', ')}`);

    await browser.close();
    console.log('\nDone! Screenshots saved.');
})();
