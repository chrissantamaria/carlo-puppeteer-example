const puppeteer = require('puppeteer-core');
const findChrome = require('./node_modules/carlo/lib/find_chrome');
const fs = require('fs').promises;
const ProgressBar = require('progress');
const revision = require('puppeteer-core/package').puppeteer.chromium_revision;

const getExecutablePath = async ({ useLocalChromium = false } = {}) => {
  if (!useLocalChromium) {
    try {
      const { executablePath } = await findChrome({});
      return executablePath;
    } catch (e) {
      console.log('No Chrome install found, trying local Chromium');
    }
  }

  const expectedPath = puppeteer.executablePath();
  try {
    await fs.stat(expectedPath);
  } catch (e) {
    await download();
  }
  return expectedPath;
};

module.exports = {
  getExecutablePath
};

const download = async () => {
  console.log(`Downloading Chromium ${revision}`);

  let bar;
  await puppeteer
    .createBrowserFetcher()
    .download(revision, (downloaded, total) => {
      if (!bar) bar = new ProgressBar('[:bar] :percent :etas', { total });
      bar.update(downloaded / total);
    });
};
