ARCE Appium Driver
=======================

Work-in-Progress...

## Use

To use this driver, Appium v2 needs to be installed first.

   ````shell
   npm install -g appium@next
   ````

To make this driver available for automation:

  ````shell
  # npm release
  appium driver install --source=npm arce-appium-driver
  # github repository
  appium driver install --source=github andreas-schoch/arce-appium-driver
  # local repository
  appium driver install --source=local /path/to/git-repos/arce-appium-driver
  ````

Then within your appium client of choice, use the following capabilities:

| Capability Name | Description                                                                                  |
|-----------------|----------------------------------------------------------------------------------------------|
| automationName  | Must be set to `ARCE`.                                                                       |
| arce:sslCert    | Path to ssl cert. E.g. `./example.crt` (Only if you want ArceServer proxy to run via https). |
| arce:sslKey     | Path to ssl key. E.g. `./example.key` (Only if you want ArceServer proxy to run via https).  |
| arce:port       | Which port the ArceServer proxy should use (default: `12000`)                                |


## TODO
- Find:
  - [x] `driver.findElement()` by: `id`, `class`, `css selector`, `xpath`, `automationId`
  - [x] `driver.findElements()` by: `id`, `class`, `css selector`, `xpath`, `automationId`
  - [x] `element.findElement()` by: `id`, `class`, `css selector`, `xpath`, `automationId`
  - [x] `element.findElements()` by: `id`, `class`, `css selector`, `xpath`, `automationId`
- Element:
  - [x] `driver.getActiveElement()`
  - [x] `element.getAttribute()`
  - [x] `element.getProperty()`
  - [x] `element.getCssProperty()`
  - [x] `element.click()`
  - [x] `element.clear()`
  - [x] `element.setValue()`
  - [x] `element.elementSelected()`
  - [ ] `element.getText()`
  - [ ] `element.getName()`
  - [ ] `element.getElementRect()`
  - [ ] `element.elementEnabled()`
  - [ ] `element.elementDisplayed()`
  - [ ] `element.getElementScreenshot()`
- Execute:
  - [ ] `executeMethod`
  - [ ] `executeCommand`
- Navigate:
  - [ ] `setUrl`
  - [ ] `getUrl`
  - [ ] `back`
  - [ ] `forward`
  - [ ] `refresh`



## License

MIT
