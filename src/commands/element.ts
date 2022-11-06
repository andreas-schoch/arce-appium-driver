import {ExternalDriver, Rect} from '@appium/types/lib/driver';
import {ArceAppiumDriver} from '../arce-appium-driver';
import {ScriptFn} from 'arce/dist/interfaces';
import {Element as AppiumElement} from '@appium/types/lib/action';

// all commands that are performed on a single (already found) element
export type ArceElementCommands = Pick<ExternalDriver, 'elementSelected' | 'getAttribute' | 'getProperty' | 'getCssProperty' | 'getText' | 'getName' | 'getElementRect' | 'elementEnabled' | 'elementDisplayed' | 'click' | 'clear' | 'setValue' | 'setValueImmediate' | 'getElementScreenshot' | 'active'>;

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
  // https://w3c.github.io/webdriver/#get-element-text
  async getText(elementId: string): Promise<string> {
    const scriptFn: ScriptFn<{ elementId: string, name: string }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      // Should technically implement the following: https://github.com/SeleniumHQ/selenium/blob/a6b161a159c3d581b130f03a2e6e35f577f38dec/javascript/atoms/dom.js#L1007
      capture(element.innerText)
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
    return captures[0] as string;
  },
  // https://w3c.github.io/webdriver/#get-element-tag-name
  async getName(elementId: string): Promise<string> {
    const scriptFn: ScriptFn<{ elementId: string, name: string }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      capture(element.tagName) // Note that result is uppercase
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
    return captures[0] as string;
  },
  // https://w3c.github.io/webdriver/#get-element-rect
  async getElementRect(elementId: string): Promise<Rect> {
    const scriptFn: ScriptFn<{ elementId: string, name: string }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      const {x, y, width, height} = element.getBoundingClientRect();
      const rect: Rect = {x, y, width, height};
      capture(rect)
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
    return captures[0] as Rect;
  },
  // https://w3c.github.io/webdriver/#is-element-enabled
  async elementEnabled(elementId: string): Promise<boolean> {
    const scriptFn: ScriptFn<{ elementId: string, name: string }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      // @ts-ignore
      capture(!element.disabled);
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
    return captures[0] as boolean;
  },
  // https://w3c.github.io/webdriver/#element-displayedness
  async elementDisplayed(elementId: string): Promise<boolean> {
    const scriptFn: ScriptFn<{ elementId: string, name: string }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');

      const {top, left, bottom, right} = element.getBoundingClientRect();
      const {clientHeight, clientWidth} = document.documentElement;
      // Note that this will only return true if WHOLE element (excluding margins) is in view.
      capture(top >= 0 && left >= 0 && bottom <= (window.innerHeight || clientHeight) && right <= (window.innerWidth || clientWidth));
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
    return captures[0] as boolean;
  },
  // https://w3c.github.io/webdriver/#get-active-element
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
  // https://w3c.github.io/webdriver/#element-clear
  async clear(elementId: string): Promise<void> {
    const scriptFn: ScriptFn<{ elementId: string }> = ({done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');

      const isHTMLInputElement = (el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement => {
        // Not sure if this is precise enough. Should work for any text fields and most other input types
        // checkbox and radio type inputs can be changed via click()
        // @ts-ignore
        return typeof el.value === 'string' && !(el.type === 'checkbox' || el.type === 'radio');
      }

      // According to https://w3c.github.io/webdriver/#element-interaction:
      // "The element interaction commands provide a high-level instruction set for manipulating form controls.
      // Unlike Actions, they will implicitly scroll elements into view and check that it is an interactable element."
      if (element.isContentEditable) {
        if (element.innerHTML === '') return done();
        element.scrollIntoView({behavior: 'auto', block: 'nearest', inline: 'nearest'});
        element.innerHTML = '';
      } else if (isHTMLInputElement(element)) {
        element.scrollIntoView({behavior: 'auto', block: 'nearest', inline: 'nearest'});
        element.value = '';
      } else {
        throw new Error('invalid element state');
      }

      done();
    };

    const {error} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
  },
  // https://w3c.github.io/webdriver/#element-send-keys
  async setValue(text: string, elementId: string): Promise<void> {
    const scriptFn: ScriptFn<{ elementId: string, text: string }> = ({done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');
      // Since programmatically triggered keyboard events are unsafe, browsers will ignore it.
      // The only other way to maybe emulate it is with the deprecated `document.execCommand('insertText', false, 'some value')` method
      // @ts-ignore
      element.value = scriptContext.text
      done();
    };

    const {error} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId, text});
    if (error) throw new Error(error);
  },
  // https://w3c.github.io/webdriver/#element-send-keys
  async setValueImmediate(text: string, elementId: string): Promise<void> {
    // @ts-ignore
    return this.setValue(text, elementId);
  },
  // https://w3c.github.io/webdriver/#is-element-selected
  elementSelected: async function (elementId: string): Promise<boolean> {
    const scriptFn: ScriptFn<{ elementId: string }> = ({done, global, capture, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const element = appiumElementsById.get(scriptContext.elementId);
      if (!element) throw new Error('no such window');

      const isCheckboxOrRadioInput = (element: HTMLElement): element is HTMLInputElement => {
        const el = element as HTMLInputElement;
        return typeof el.value === 'string' && (el.type === 'checkbox' || el.type === 'radio');
      };

      const isOptionsElement = (el: HTMLElement): el is HTMLOptionElement => {
        return typeof (el as HTMLOptionElement).selected === 'boolean';
      };

      if (isCheckboxOrRadioInput(element)) capture(element.checked);
      else if (isOptionsElement(element)) capture(element.selected);
      else capture(false);
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {elementId});
    if (error) throw new Error(error);
    return captures[0] as boolean;
  }
};
