import {ArceFindCommands, findCommands} from './find';
import {ArceElementCommands, elementCommands} from './element';
import {ArceNavigateCommands, navigateCommands} from './navigate';
import {ArceExecuteCommands, executeCommands} from './execute';


// TODO find a more elegant way to have "mixins"
export const commands: ArceFindCommands & ArceElementCommands & ArceNavigateCommands & ArceExecuteCommands = {
  ...findCommands,
  ...elementCommands,
  ...navigateCommands,
  ...executeCommands,
};
