const carlo = require('carlo');
const path = require('path');
const puppeteer = require('puppeteer-core');

const { getExecutablePath } = require('./utils');

(async () => {
  const executablePath = await getExecutablePath({
    // useLocalChromium: true
  });
  console.log('Executable path:', executablePath);

  launchCarlo({ executablePath });
  launchPuppeteer({ executablePath });
})().catch(console.error);

const launchCarlo = async launchOptions => {
  const app = await carlo.launch({
    ...launchOptions
  });

  app.on('exit', () => process.exit());

  app.serveFolder(path.join(__dirname, 'public'));
  await app.load('index.html');

  // Exposing server-side console.log to the client
  await app.exposeFunction('logServer', console.log);
};

const launchPuppeteer = async launchOptions => {
  // Navigating to Wikipedia, going to a random page and triggering an alert

  const browser = await puppeteer.launch({
    headless: false,
    // --app opens the window without address bar, similar to Carlo
    args: ['--app=https://en.wikipedia.org', '--window-size=800,600'],
    ...launchOptions
  });

  const [page] = await browser.pages();
  await page.waitForNavigation();
  await Promise.all([page.click('#n-randompage'), page.waitForNavigation()]);

  await page.evaluate(() => alert('Function injected from server!'));
};
