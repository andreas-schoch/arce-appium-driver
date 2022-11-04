import {FindCommands} from '@appium/types/lib/driver';
import {Element as AppiumElement} from '@appium/types/lib/action';
// @ts-ignore TODO create declarations myself
import xPathToCss from 'xpath-to-css';
import {ArceAppiumDriver, ArceLocatorStrategies} from '../arce-appium-driver';
import {ScriptFn} from 'arce/dist/interfaces';

export type ArceFindCommands = Pick<FindCommands, 'findElOrEls' | 'getPageSource'>; // only interested in the methods that need to be implemented

export const findCommands: ArceFindCommands = {
  // BaseDriver expects this method to be implemented see: node_modules/@appium/base-driver/build/lib/basedriver/commands/find.js
  // It is used internally by the following commands:
  // - findElement() https://w3c.github.io/webdriver/#find-element
  // - findElementFromElement() https://w3c.github.io/webdriver/#find-element-from-element
  // - findElements() https://w3c.github.io/webdriver/#find-elements
  // - findElementsFromElement() https://w3c.github.io/webdriver/#find-elements-from-element
  findElOrEls: async function <Mult extends boolean>(strategy: ArceLocatorStrategies, selector: string, mult: Mult, rootElementId?: string): Promise<Mult extends true ? AppiumElement[] : AppiumElement> {
    const scriptFn: ScriptFn<{ rootElementId: string, mult: boolean, selector: string }> = ({capture, done, global, scriptContext}) => {
      // These Maps are used to keep track of already found elements
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const appiumIdsByElement: Map<HTMLElement, string> = global.appiumIdsByElement as Map<HTMLElement, string> || new Map();
      console.log(appiumElementsById, appiumIdsByElement, scriptContext);

      const asAppiumElement = (element: HTMLElement): AppiumElement => {
        const alreadyCachedElementId = appiumIdsByElement.get(element);
        if (alreadyCachedElementId) return ({'element-6066-11e4-a52e-4f735466cecf': alreadyCachedElementId});
        const newId = Math.random().toString(36).slice(2, 20);
        appiumElementsById.set(newId, element);
        appiumIdsByElement.set(element, newId);
        return ({'element-6066-11e4-a52e-4f735466cecf': newId});
      };

      let root: Document | HTMLElement = document;
      if (scriptContext.rootElementId) {
        const rootElement = appiumElementsById.get(scriptContext.rootElementId);
        if (!rootElement) throw new Error(`root element with id "${scriptContext.rootElementId}" does not exist anymore`);
        root = rootElement;
      }

      if (scriptContext.mult) {
        const elements: HTMLElement[] = Array.from(root.querySelectorAll(scriptContext.selector));
        capture(elements.map(element => asAppiumElement(element)));
      } else {
        const element: HTMLElement | null = root.querySelector(scriptContext.selector);
        if (element) capture(asAppiumElement(element));
      }

      global.appiumElementsById = appiumElementsById;
      global.appiumIdsByElement = appiumIdsByElement;

      done();
    };

    selector = toCssSelector(strategy, selector);
    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn, {rootElementId, mult, selector});
    if (error) throw new Error(error);
    // @ts-ignore
    return Promise.resolve(mult ? captures[0] as AppiumElement[] : captures[0] as AppiumElement);
  },
  // BaseDriver calls this internally for debugging purposes when findElOrEls() throws an error within findElOrElsWithProcessing()
  // https://w3c.github.io/webdriver/#get-page-source
  getPageSource: async function (): Promise<string> {
    const scriptFn: ScriptFn = ({done, capture, global}) => {
      capture(global.document.body.innerHTML);
      done();
    };

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(scriptFn);
    if (error) throw new Error(error);
    return captures[0] as string;
  },
};

const toCssSelector = (strategy: ArceLocatorStrategies, selector: string): string => {
  switch (strategy) {
    case 'css selector':
      return selector;
    case 'xpath':
      return xPathToCss(selector);
    case 'tag name':
      return selector;
    case 'class name':
      return '.' + selector;
    case 'id':
    case 'accessibility id':
      return '#' + selector;
  }
};
