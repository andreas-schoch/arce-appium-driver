import {ExternalDriver} from '@appium/types/lib/driver';

export type ArceWindowCommands = Pick<ExternalDriver, 'getWindowRect' | 'setWindowRect' | 'minimizeWindow' | 'maximizeWindow' | 'getWindowHandle' | 'closeWindow' | 'createNewWindow' | 'fullScreenWindow' | 'setWindow' | 'getWindowSize' | 'getWindowHandles'>;

// TODO implement whatever is possible. Some of them are not supported programmatically by regular browser runtime (e.g. without CDP)
export const windowCommands: ArceWindowCommands = {};
