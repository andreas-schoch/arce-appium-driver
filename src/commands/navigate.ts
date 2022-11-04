import {ExternalDriver} from '@appium/types/lib/driver';


export type ArceNavigateCommands = Pick<ExternalDriver, 'setUrl' | 'getUrl' | 'back' | 'forward' | 'refresh'>;

export const navigateCommands: ArceNavigateCommands = {
  setUrl(url: string): Promise<void> {
    return Promise.resolve();
  },
  getUrl(): Promise<string> {
    return Promise.resolve('');
  },
  back(): Promise<void> {
    return Promise.resolve();
  },
  forward(): Promise<void> {
    return Promise.resolve();
  },
  refresh(): Promise<void> {
    return Promise.resolve();
  },
};
