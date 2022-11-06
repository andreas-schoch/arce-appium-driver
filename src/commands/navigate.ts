import {ExternalDriver} from '@appium/types/lib/driver';
import {ScriptFn} from 'arce/dist/interfaces';
import {ArceAppiumDriver} from '../arce-appium-driver';


export type ArceNavigateCommands = Pick<ExternalDriver, 'setUrl' | 'getUrl' | 'back' | 'forward' | 'refresh'>;

export const navigateCommands: ArceNavigateCommands = {
  async setUrl(url: string): Promise<void> {
    const scriptFn: ScriptFn<{ url: string }> = ({done, global, scriptContext}) => {
      global.location.href = scriptContext.url;
      done();
    };

    const {error} = await ArceAppiumDriver.arceServer.execute(scriptFn, {url});
    if (error) throw new Error(error);
  },
  async getUrl(): Promise<string> {
    const {error, captures} = await ArceAppiumDriver.arceServer.execute(({done, global, capture}) => {
      capture(global.location.href);
      done();
    });
    if (error) throw new Error(error);
    return captures[0] as string;
  },
  async back(): Promise<void> {
    const {error} = await ArceAppiumDriver.arceServer.execute(({done, global}) => {
      global.history.go(-1);
      done();
    });
    if (error) throw new Error(error);
  },
  async forward(): Promise<void> {
    const {error} = await ArceAppiumDriver.arceServer.execute(({done, global}) => {
      global.history.go(1);
      done();
    });
    if (error) throw new Error(error);
  },
  async refresh(): Promise<void> {
    const {error} = await ArceAppiumDriver.arceServer.execute(({done, global}) => {
      global.location.reload();
      done();
    });
    if (error) throw new Error(error);
  },
};
