import {ExternalDriver} from '@appium/types/lib/driver';
import {ArceAppiumDriver} from '../arce-appium-driver';
import {ScriptFn} from 'arce/dist/interfaces';
import {Element as AppiumElement} from '@appium/types/lib/action';

// all commands that are performed on a single (already found) element
export type ArceElementCommands = Pick<ExternalDriver, 'elementSelected' | 'getAttribute' | 'getProperty' | 'getCssProperty' | 'getText' | 'getName' | 'getElementRect' | 'elementEnabled' | 'elementDisplayed' | 'click' | 'clear' | 'setValue' | 'getElementScreenshot' | 'active'>;

// A (probably not) complete list of all boolean attributes in HTML. It's string value needs to be transformed into true if present to conform to w3c standard
const booleanAttributes: Set<string> = new Set(['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'defer', 'disabled', 'formnovalidate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected']);

export const elementCommands: ArceElementCommands = {
  // https://w3c.github.io/webdriver/#get-element-attribute
  async getAttribute(name: string, elementId: string): Promise<string | null> {
    const scriptFn: ScriptFn<{ elementId: string, name: string, isBool: boolean }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      // 'If the attribute is present, its value must either be the empty string or a value that is an ASCII case-insensitive match for
      // the attribute's canonical name' - https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
      // According to webdriver protocol getAttribute must return true or null
      const attr = element.getAttribute(scriptContext.name);
      capture(scriptContext.isBool ? attr !== null ? true : null : attr);
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId, name, isBool: booleanAttributes.has(name)});
    if (error) throw new Error(error);
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
  async active(): Promise<AppiumElement> {
    const scriptFn: ScriptFn = ({done, global, capture}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const appiumIdsByElement: Map<HTMLElement, string> = global.appiumIdsByElement as Map<HTMLElement, string> || new Map();

      // TODO deduplicate once ARCE implements preloading feature that allows utils to be loaded in advance
      const asAppiumElement = (element: HTMLElement): AppiumElement => {
        const alreadyCachedElementId = appiumIdsByElement.get(element);
        if (alreadyCachedElementId) return ({'element-6066-11e4-a52e-4f735466cecf': alreadyCachedElementId});
        const newId = Math.random().toString(36).slice(2, 20);
        appiumElementsById.set(newId, element);
        appiumIdsByElement.set(element, newId);
        return ({'element-6066-11e4-a52e-4f735466cecf': newId});
      };

      if (!global.document.activeElement) throw new Error('no such element');
      capture(asAppiumElement(global.document.activeElement as HTMLElement))
      global.appiumElementsById = appiumElementsById;
      global.appiumIdsByElement = appiumIdsByElement;
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn);
    if (error) throw new Error(error);
    return captures[0] as AppiumElement;
  },
  // https://w3c.github.io/webdriver/#element-click
  async click(elementId: string): Promise<void> {
    const scriptFn: ScriptFn<{ elementId: string }> = ({done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');

      // According to https://w3c.github.io/webdriver/#element-interaction:
      // "The element interaction commands provide a high-level instruction set for manipulating form controls.
      // Unlike Actions, they will implicitly scroll elements into view and check that it is an interactable element."
      element.scrollIntoView({behavior: 'auto', block: 'nearest', inline: 'nearest'});
      element.click();
      done();
    };

    const {error} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
  },
  // // // https://w3c.github.io/webdriver/#element-send-keys
  // async setValue(text: string, elementId: string): Promise<void> {
  //   const scriptFn: ScriptFn<{ elementId: string, text: string }> = ({done, global, scriptContext}) => {
  //     const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
  //     const element = appiumElementsById.get(scriptContext.elementId);
  //     if (!element) throw new Error('no such window');
  //     if (element === global.document)
  //     element.click();
  //     done();
  //   };
  //
  //   const {error} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId, text});
  //   if (error) throw new Error(error);
  // },

};
