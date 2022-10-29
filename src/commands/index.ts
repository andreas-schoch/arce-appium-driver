import {FindCommands} from '@appium/types/lib';
import {findCommands} from './find';
import {executeCommands} from './execute';
import {ElementCommands, elementCommands} from './element';


export const commands: FindCommands & ElementCommands = {
  ...findCommands,
  ...elementCommands,
  // ...executeCommands,
};
