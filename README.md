# carlo-puppeteer-example

This repo is a proof-of-concept implementation of a [Carlo](https://github.com/GoogleChromeLabs/carlo)-based frontend alongside a [Puppeteer](https://www.npmjs.com/package/puppeteer-core)-based web scraper, all running from either an existing Chrome install or new local Chromium install. Using an existing install results in a dramatically reduced application size, but new installs are offered as a fallback.

Both Carlo and Puppeteer are used in this example, but either could be run independently depending on a project's needs - the process of locating a Chrome/Chromium executable remains the same.

## Usage

Install dependencies (not including a local copy of Chromium)

```
yarn
```

Run the app

```
yarn start
```

After a Chrome/Chromium executable is found, the app will open both a Carlo frontend as well as a controlled Puppeteer browser.

Carlo displays a basic frontend which shows off executing server-side functions from the client - clicking the button will log a message to the Node console.

Puppeteer loads Wikipedia and clicks on the "Random page" button, showing off its automation functionality. Additionally, an alert is shown, displaying how functions can be injected into client pages from the server.

## How it works

The app first locates a suitable Chrome/Chromium executable for Carlo + Puppeteer to use. Carlo's own `findChrome` function is called to locate existing installs, with locations checked varying on runtime platform.

If an existing install is not found, puppeteer-core will check for a copy of its prefered Chromium version in `./node_modules/puppeteer-core/.local-chromium` - if one isn't found, it will automatically download one. Additionally, you can force this behavior by passing `useLocalChromium: true` as an option when calling `getExecutablePath`. This copy can be upwards of 300MB, so it's generally preferable to use an existing Chrome install if possible.

After successfully obtaining an executable path, both Carlo and Puppeteer are lauched.

## Notes

Using an existing install offers no way of enforcing a specific version, but in most cases that shouldn't present an issue. Carlo requires a Chrome/Chromium version 54.0 or later, though compatibility with older versions / in Puppeteer is untested.

puppeteer-core is used in favor of puppeteer as it does not include Chromium when installed - the actual automation functionality should be the same (see [puppeteer vs puppeteer-core](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteer-vs-puppeteer-core))
