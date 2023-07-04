const puppeteer = require('puppeteer');
const randomAdjective = require('./getAdjective');

const { COHOST_EMAIL, COHOST_PW } = require('./SECRETS');

(async () => {
    const browser = await puppeteer.launch({ devtools: true });
    const page = await browser.newPage();

    await page.goto('https://cohost.org/rc/login');

    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');

    await emailInput.type(COHOST_EMAIL);
    await passwordInput.type(COHOST_PW);
    await submitButton.click();

    console.log(page.url());
    await page.waitForNavigation({
        waitUntil: 'networkidle2',
    });

    console.log(page.url());

    const hamburger = 'button';

    // await page.waitForSelector(hamburger);
    await page.click(hamburger);

    const buttonXPath = `//button[contains(text(), "profile")]`;
    const [buttonElement] = await page.$x(buttonXPath);

    if (buttonElement) {
        await buttonElement.click();
        console.log('Button clicked!');
    } else {
        console.log('Button not found!');
    }

    // Type into search box
    // await page.type('.search-box__input', 'automate beyond recorder');
    // Wait and click on first result
    // const searchResultSelector = '.search-box__link';
    // await page.waitForSelector(searchResultSelector);
    // await page.click(searchResultSelector);
    // Locate the full title with a unique string
    // const textSelector = await page.waitForSelector('text/Customize and automate');
    // const fullTitle = await textSelector?.evaluate((el) => el.textContent);
    // Print the full title
    // console.log('The title of this blog post is "%s".', fullTitle);
    // await browser.close();
})();
