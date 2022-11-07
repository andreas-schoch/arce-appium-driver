import {ArceAppiumDriver} from '../arce-appium-driver';
import {ExternalDriver} from '@appium/types/lib/driver';


export type ArceExecuteCommands = Pick<ExternalDriver, 'execute' | 'executeAsync'>;
// For now the script must follow the convention of an ArceCommand by wrapping it in a function.
// In the future, ARCE will either be adjusted to work with arbitrary unstructured scripts or the methods below will be modified
// until arbitrary script can be processed properly. For now the script must look like the following:
// - "({capture, done, scriptContext}) => {console.log(scriptContext.args[0]); done()};
// - "async ({capture, done}) => {capture(await new Promise(res => setTimeout(() => res('hello'), 2000))); done()};
export const executeCommands: ArceExecuteCommands = {
  async executeAsync(script: string, args: unknown[]): Promise<unknown> {
    const {error, captures} = await ArceAppiumDriver.arceServer.executeString(script, {args});
    if (error) throw new Error(error);
    return captures[0];
  },
  async execute(script: string, args: unknown[]): Promise<unknown> {
    // @ts-ignore
    return this.executeAsync(script, args)
  }
};
