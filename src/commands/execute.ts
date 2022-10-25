import {ExecuteCommands, StringRecord} from "@appium/types/lib";
import {ArceAppiumDriver} from "../arce-appium-driver";

export const executeCommands: ExecuteCommands = {
  async executeMethod(script: string, args: [StringRecord] | []): Promise<unknown> {
    // TODO make it work with arbitrary scripts. For now simply relaying to ARCE
    //  Maybe add a flag to ARCE to allow any script to run and capture whatever is evaluated or returned
    const {error, captures} = await ArceAppiumDriver.arceServer.executeString(script, {args});
    if (error) throw new Error(error);
    return captures[0];
  }
};