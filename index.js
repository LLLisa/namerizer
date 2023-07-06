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

    console.log('started');

    await page.goto('https://cohost.org/rc/login');

    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const loginSubmitButton = await page.$('button[type="submit"]');

    await emailInput.type(COHOST_EMAIL);
    await passwordInput.type(COHOST_PW);
    await loginSubmitButton.click();

    console.log('logged in');

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

    console.log('dispaly name typed');

    const saveChangesButton = await page.$('button[type="submit"]');
    await saveChangesButton.click();

    //these two lines are accounting for a bug that has been reported
    await page.select('select', 'roundrect');
    await saveChangesButton.click();

    console.log('display name entered');

    await page.waitForNavigation({
      waitUntil: 'networkidle2',
    });

    const newUrl = await page.url();

    console.log('finished');

    const logMess =
      newUrl !== 'https://cohost.org/rc/project/edit'
        ? `Cohost display name changed to ${newDisplayName}`
        : 'Display name unchanged, check error log';

    // const date = new Date();
    // const options = {
    //   timeZone: 'America/New_York',
    //   // Use the following options to customize the output format:
    //   year: 'numeric',
    //   month: '2-digit',
    //   day: '2-digit',
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   second: '2-digit',
    // };

    // const logDateTime = date.toLocaleString('en-US', options).replace(/\s/g, '');

    // fs.appendFile('./namerizer_log.txt', `${logDateTime}: ${logMess}` + '\n', (err) => {
    //   if (err) throw err;
    //   console.log(logMess);
    // });

    await logOut(logFile, logMess);

    await browser.close();
  } catch (error) {
    await logOut(logFile, error);

    console.log(error);
  }
})();
