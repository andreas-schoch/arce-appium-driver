import {ArceFindCommands, findCommands} from './find';
import {ArceElementCommands, elementCommands} from './element';


export const commands: ArceFindCommands & ArceElementCommands = {
  ...findCommands,
  ...elementCommands,
  // ...executeCommands,
};
