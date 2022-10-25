import {FindCommands} from "@appium/types/lib/driver";
import {Element as AppiumElement} from "@appium/types/lib/action";
import {ArceAppiumDriver} from "../arce-appium-driver";
import {ScriptFn} from "arce/dist/interfaces";

export const findCommands: FindCommands = {
  findElOrEls: async function <Mult extends boolean>(strategy: 'css selector', selector: string, mult: Mult, rootElementId?: string): Promise<Mult extends true ? AppiumElement[] : AppiumElement> {

    const script: ScriptFn<{ rootElementId: string, mult: boolean, selector: string }> = ({capture, done, global, scriptContext}) => {
      const appiumElementsById: Map<string, HTMLElement> = global.appiumElementsById as Map<string, HTMLElement> || new Map();
      const appiumIdsByElement: Map<HTMLElement, string> = global.appiumIdsByElement as Map<HTMLElement, string> || new Map();
      console.log(appiumElementsById, appiumIdsByElement);

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

    const {error, captures} = await ArceAppiumDriver.arceServer.execute(script, {rootElementId, mult});
    if (error) throw new Error(error);
    // @ts-ignore
    return Promise.resolve(mult ? captures[0] as AppiumElement[] : captures[0] as AppiumElement);
  },
  findElOrElsWithProcessing<Mult extends boolean>(strategy: string, selector: string, mult: Mult, context?: string): Promise<Mult extends true ? AppiumElement[] : AppiumElement> {
    return this.findElOrEls(strategy, selector, mult, context);
  },
  findElement: function (strategy: 'css selector', selector: string): Promise<AppiumElement> {
    return this.findElOrEls<false>(strategy, selector, false);
  },
  findElementFromElement: function (strategy: 'css selector', selector: string, elementId: string): Promise<AppiumElement> {
    return this.findElOrEls<false>(strategy, selector, false, elementId);
  },
  findElements: function (strategy: 'css selector', selector: string): Promise<AppiumElement[]> {
    return this.findElOrEls(strategy, selector, true);
  },
  findElementsFromElement: function (strategy: 'css selector', selector: string, elementId: string): Promise<AppiumElement[]> {
    return this.findElOrEls(strategy, selector, true, elementId);
  },
  getPageSource: function (): Promise<string> {
    // TODO find a way to serialize whole DOM (as json I suppose?)
    return Promise.resolve("");
  }
};
