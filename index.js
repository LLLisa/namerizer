const puppeteer = require('puppeteer');
const randomAdjective = require('./getAdjective');
const { logOut } = require('./logger');

const { COHOST_EMAIL, COHOST_PW } = require('./SECRETS');
const logFile = './namerizer_log.txt';

(async () => {
  try {
    //---this line for raspbian---
    const browser = await puppeteer.launch({
      product: 'chrome',
      executablePath: '/usr/bin/chromium-browser',
    });
    //---this line for other linux---
    // const browser = await puppeteer.launch({ headless: false });

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

    //these two lines are accounting for a bug that has been reported
    await page.select('select', 'roundrect');
    await saveChangesButton.click();

    await page.waitForNavigation({
      waitUntil: 'networkidle2',
    });

    const newUrl = await page.url();

    const logMess =
      newUrl !== 'https://cohost.org/rc/project/edit'
        ? `Cohost display name changed to ${newDisplayName}`
        : 'Display name unchanged, check error log';

    await logOut(logFile, logMess);
    await browser.close();
  } catch (error) {
    await logOut(logFile, error);
    console.log(error);
  }
})();
