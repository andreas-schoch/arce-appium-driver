import {ArceFindCommands, findCommands} from './find';
import {ArceElementCommands, elementCommands} from './element';
import {navigateCommands} from './navigate';


export const commands: ArceFindCommands & ArceElementCommands = {
  ...findCommands,
  ...elementCommands,
  ...navigateCommands
  // ...executeCommands,
};
