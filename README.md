ARCE Appium Driver
=======================

Work-in-Progress...

An experimental "browser-agnostic" appium driver.

In most scenarios you should probably use another driver. This is more of a "last resort" solution.

_(TODO explain use-cases in a bit more detail.)_

## Usage

To use this driver, Appium v2 needs to be installed first.

   ````shell
   npm install -g appium@next
   ````

Make this driver available for automation:

  ````shell
  # npm release
  appium driver install --source=npm arce-appium-driver
  # github repository
  appium driver install --source=github andreas-schoch/arce-appium-driver
  # local repository
  appium driver install --source=local /path/to/git-repos/arce-appium-driver
  ````

And start the appium server:

  ````shell
  appium server
  ````

Then within your appium client of choice, use the following capabilities:

| Capability Name | Description                                                                                  |
|-----------------|----------------------------------------------------------------------------------------------|
| automationName  | Must be set to `ARCE`.                                                                       |
| arce:sslCert    | Path to ssl cert. E.g. `./example.crt` (Only if you want ArceServer proxy to run via https). |
| arce:sslKey     | Path to ssl key. E.g. `./example.key` (Only if you want ArceServer proxy to run via https).  |
| arce:port       | Which port the ArceServer proxy should use (default: `12000`)                                |

## TODO

- **Find**:
    - [x] `driver.findElement()` by: `id`, `class`, `css selector`, `xpath`, `automationId`
    - [x] `driver.findElements()` by: `id`, `class`, `css selector`, `xpath`, `automationId`
    - [x] `element.findElement()` by: `id`, `class`, `css selector`, `xpath`, `automationId`
    - [x] `element.findElements()` by: `id`, `class`, `css selector`, `xpath`, `automationId`
- **Element**:
    - [x] `driver.getActiveElement()`
    - [x] `element.active()`
    - [x] `element.getAttribute()`
    - [x] `element.getProperty()`
    - [x] `element.getCssProperty()`
    - [x] `element.click()`
    - [x] `element.clear()`
    - [x] `element.setValue()`
    - [x] `element.setValueImmediate()`
    - [x] `element.elementSelected()`
    - [x] `element.getText()`
    - [x] `element.getName()`
    - [x] `element.getElementRect()`
    - [x] `element.elementEnabled()`
    - [x] `element.elementDisplayed()`
- **Execute**:
    - [x] `execute()` _(expected to be a valid arce command script for now)_
    - [x] `executeAsync()` _(expected to be a valid arce command script for now)_
- **Navigate**:
    - [x] `setUrl`
    - [x] `getUrl`
    - [x] `back`
    - [x] `forward`
    - [x] `refresh`
- **Cookies**:
    - [ ] `getCookies()`
    - [ ] `getCookie()`
    - [ ] `setCookie()`
    - [ ] `deleteCookie()`
    - [ ] `deleteCookies()`
- **Window** _(The strike-through commands can likely only be supported to a limited extent, or not at all, via ARCE)_:
    - [ ] `getWindowRect()`
    - [ ] ~~`setWindow()`~~
    - [ ] ~~`createNewWindow()`~~
    - [ ] ~~`closeWindow()`~~
    - [ ] ~~`setWindowRect()`~~
    - [ ] ~~`maximizeWindow()`~~
    - [ ] ~~`minimizeWindow()`~~
    - [ ] ~~`fullScreenWindow()`~~
    - [ ] ~~`getWindowHandle()`~~
- **Action** _(A lot of the possible actions chains cannot be fully supported via ARCE.)_:
    - [ ] `performActions()`
    - [ ] `releaseActions()`
- **Screenshot**:
    - [ ] `element.getElementScreenshot()` _(Can maybe be supported via `html2canvas` npm package or `getUserMedia`
      API)_
    - [ ] `driver.getScreenshot()`
- **Timeout** _(Not sure yet which ones are useful or expected to be implemented)_:
    - [ ] `driver.setNewCommandTimeout()`
    - [ ] `driver.implicitWait()`
    - [ ] `driver.setImplicitWait()`
    - [ ] `driver.implicitWaitForCondition()`
    - [ ] `driver.getTimeouts()`
    - [ ] `driver.implicitWaitW3C()`
    - [ ] `driver.pageLoadTimeoutW3C()`
    - [ ] `driver.scriptTimeoutW3C()`
    - [ ] `driver.newCommandTimeout()`
    - [ ] `driver.parseTimeoutArgument()`

  (List incomplete. A few misc commands omitted)

## License

MIT
