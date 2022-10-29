import {ExternalDriver} from '@appium/types/lib/driver';
import {ArceAppiumDriver} from '../arce-appium-driver';
import {ScriptFn} from 'arce/dist/interfaces';

export type ElementCommands = Pick<ExternalDriver, 'elementSelected' | 'getAttribute' | 'getProperty' | 'getCssProperty' | 'getText' | 'getName' | 'getElementRect' | 'elementEnabled' | 'elementDisplayed' | 'click' | 'clear' | 'setValue' | 'getElementScreenshot'>;
const booleanAttributes: Set<string> = new Set(['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'defer', 'disabled', 'formnovalidate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected']);


export const elementCommands: ElementCommands = {
  // https://w3c.github.io/webdriver/#get-element-attribute
  async getAttribute(name: string, elementId: string): Promise<string | null> {
    const scriptFn: ScriptFn<{ elementId: string, name: string, isBool: boolean }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) {
        throw new Error('no such window');
      }
      // 'If the attribute is present, its value must either be the empty string or a value that is an ASCII case-insensitive match for
      // the attribute's canonical name' - https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
      // According to webdriver protocol getAttribute must return true or null and therefore.
      const attr = element.getAttribute(scriptContext.name);
      capture(scriptContext.isBool ? attr !== null ? true : null : attr);
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId, name, isBool: booleanAttributes.has(name)});
    if (error) {
      throw new Error(error);
    }
    return captures[0] as string;
  },
  // https://w3c.github.io/webdriver/#get-element-property
  async getProperty(name: string, elementId: string): Promise<string | null> {
    const scriptFn: ScriptFn<{ elementId: string, name: string }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      // Not sure if I can fully explain difference between attributes vs properties, but for example for el: <input type='text' required>
      // - el['required']               --> results in true
      // - el.getAttribute('required')  --> results in ''
      // @ts-ignore
      const prop: unknown = element[scriptContext.name];
      if (prop === null || prop === undefined) capture(null);
      else capture(String(prop)); // Should I check for fns and objects to avoid '[object Object]' etc.? Should it throw an error?
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {name, elementId});
    if (error) throw new Error(error);
    return captures[0] as string;
  },
  // https://w3c.github.io/webdriver/#get-element-css-value
  async getCssProperty(name: string, elementId: string): Promise<string> {
    const scriptFn: ScriptFn<{ elementId: string, name: string }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      // @ts-ignore
      const prop: unknown = element.style[scriptContext.name];
      if (prop === null || prop === undefined) capture(null);
      else capture(String(prop) || '');
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {name, elementId});
    if (error) throw new Error(error);
    return captures[0] as string;
  },
  // https://w3c.github.io/webdriver/#element-click
  async click(elementId: string): Promise<void> {
    const scriptFn: ScriptFn<{ elementId: string }> = ({done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      element.click();
      done();
    };

    const {error} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
  },

};
