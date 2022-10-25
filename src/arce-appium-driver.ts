import {BaseDriver} from "@appium/base-driver";

import {desiredCapConstraints} from "./desired-caps";
import {Capabilities, W3CCapabilities} from "@appium/base-driver/build/lib/basedriver/driver";
import {ArceServer} from "arce/dist/arce-server";
import {commands} from "./commands";


export class ArceAppiumDriver extends BaseDriver {
  static arceServer: ArceServer;

  constructor(opts = {}, shouldValidateCaps = true) {
    super(opts, shouldValidateCaps);
    ArceAppiumDriver.arceServer = new ArceServer(); // TODO SSL and port configurable
    this.desiredCapConstraints = desiredCapConstraints;
    this.locatorStrategies = [
      // 'xpath', // TODO translate xpaths to css selectors. Something like https://www.npmjs.com/package/xpath-to-css might work
      'css selector',
    ];
    this.resetState();

    for (const [cmd, fn] of Object.entries(commands)) {
      // @ts-ignore
      this.prototype[cmd] = fn;
    }
  }

  resetState() {
    console.log('reset state');
  }

  async createSession(w3cCapabilities1: W3CCapabilities, w3cCapabilities2?: W3CCapabilities, w3cCapabilities?: W3CCapabilities): Promise<[string, Capabilities]> {
    try {
      const [sessionId, caps] = await super.createSession(w3cCapabilities1, w3cCapabilities2, w3cCapabilities);
      this.log.info('Creating ARCE server session', sessionId, caps);
      // TODO currently no support for multiple sessions as ARCE only supports 1 connected client atm
      await ArceAppiumDriver.arceServer.start();
      return [sessionId, caps];
    } catch (e) {
      await this.deleteSession();
      throw e;
    }
  }

  async deleteSession() {
    this.log.info('Deleting ARCE server session');
    ArceAppiumDriver.arceServer.stop();
    await super.deleteSession();
  }
}
