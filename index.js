const puppeteer = require('puppeteer');
const randomAdjective = require('./getAdjective');

const { COHOST_EMAIL, COHOST_PW } = require('./SECRETS');

(async () => {
    //remove executablePath below if not on raspberry pi
    const browser = await puppeteer.launch({ executablePath: '/usr/share/applications/chromium-browser.desktop' });
    const page = await browser.newPage();

    await page.goto('https://cohost.org/rc/login');

    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const loginSubmitButton = await page.$('button[type="submit"]');

    await emailInput.type(COHOST_EMAIL);
    await passwordInput.type(COHOST_PW);
    await loginSubmitButton.click();

    await page.waitForNavigation({
        waitUntil: 'networkidle2',
    });

    await page.goto('https://cohost.org/rc/project/edit', {
        waitUntil: 'networkidle2',
    });

    const newDisplayName = `${randomAdjective} dolphin`;

    const displayNameInput = await page.$('input');
    await displayNameInput.click({ clickCount: 3 });
    await displayNameInput.press('Backspace');
    await displayNameInput.type(newDisplayName);

    const saveChangesButton = await page.$('button[type="submit"]');
    await saveChangesButton.click();

    await browser.close();
    console.log(`Cohost display name changed to ${newDisplayName}`);
})();
