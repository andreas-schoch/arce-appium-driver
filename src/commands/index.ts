import {FindCommands, ExecuteCommands} from "@appium/types/lib";
import {findCommands} from "./find";
import {executeCommands} from "./execute";


export const commands: FindCommands & ExecuteCommands = {
  ...findCommands,
  ...executeCommands
};
