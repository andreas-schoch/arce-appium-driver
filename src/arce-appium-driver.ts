import {Capabilities, W3CCapabilities} from 'appium/build/lib/utils';
import {BaseDriver} from 'appium/driver';
import {desiredCapConstraints} from './desired-caps';
import {ArceServer} from 'arce/dist/arce-server';
import {commands} from './commands';

export type ArceLocatorStrategies = 'css selector' | 'xpath' | 'tag name' | 'class name' | 'accessibility id' | 'id';

export class ArceAppiumDriver extends BaseDriver {
  static arceServer: ArceServer;

  constructor(opts = {}, shouldValidateCaps = false) {
    super(opts, shouldValidateCaps);
    this.log.info('ArceAppiumDriver constructor', opts, shouldValidateCaps);
    this.desiredCapConstraints = desiredCapConstraints;
    this.locatorStrategies = ['css selector', 'xpath', 'tag name', 'class name', 'accessibility id', 'id'] as ArceLocatorStrategies[];
    this.resetState();

    for (const [cmd, fn] of Object.entries(commands)) {
      // TODO try to refactor individual commands into some form of mixin that work better with typescript
      // @ts-ignore
      this[cmd] = fn;
    }
  }

  resetState() {
    console.log('reset state');
  }

  async createSession(w3cCapabilities1: W3CCapabilities, w3cCapabilities2?: W3CCapabilities, w3cCapabilities?: W3CCapabilities): Promise<[string, Capabilities]> {
    try {
      const [sessionId, caps] = await super.createSession(w3cCapabilities1, w3cCapabilities2, w3cCapabilities);
      this.log.info('Creating ARCE server session', sessionId, JSON.stringify(caps));

      const sslCert = caps['arce:sslCert'] || '';
      const sslKey = caps['arce:sslKey'] || '';
      const port = caps['arce:port'] || 12000;

      ArceAppiumDriver.arceServer = new ArceServer(sslCert, sslKey, port);
      await ArceAppiumDriver.arceServer.start();
      return [sessionId, caps];
    } catch (e) {
      await this.deleteSession();
      throw e;
    }
  }

  async deleteSession() {
    await super.deleteSession();
    this.log.info('Deleting ARCE server session');
    ArceAppiumDriver.arceServer.stop();
    await super.deleteSession();
  }
}
