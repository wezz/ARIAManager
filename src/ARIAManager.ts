﻿/*
This script will respect WAI-ARIA attributes and update those attribute's states.
This is mostly used for toggling section visibility

Regular Example:
<button aria-controls="mycontent" aria-pressed="false">Toggle</button>
<div id="mycontent" aria-hidden="true">Hidden until button is pressed</div>


Delayed state change
<button
    aria-controls="mycontent"
    aria-pressed="false"
    data-ariamanager-delay="150">Toggle</button>
<div
    id="mycontent"
    aria-hidden="true">Hidden until button is pressed</div>
*/
export default class ARIAManager {
  private controlelements: HTMLElement[] = [];
  private controlselector = "[aria-controls]:not([data-ariamanager-ignore])";
  private delayAttribute = "data-ariamanager-delay";
  constructor(options?: ARIAManagerInitiationOptions) {
    const constructorOptions = this.parseOptions(options);
    if (!constructorOptions.initiateElements) {
      return;
    }
    this.InitiateElements(constructorOptions.parent);
    window.addEventListener("global-markupchange", ((e: CustomEvent) => {
      this.InitiateElements(e?.detail?.target ?? document);
    }) as EventListener);
  }

  private parseOptions(options?: ARIAManagerInitiationOptions) {
    const defaultOptions = { parent: document.body, initiateElements: true };
    if (
      !options ||
      typeof options !== "object" ||
      (typeof options.parent === "undefined" &&
        typeof options.initiateElements === "undefined")
    ) {
      return defaultOptions;
    }
    return { ...defaultOptions, ...options };
  }

  public InitiateElements(parent: HTMLElement = document.body) {
    const controlElements = [].slice.call(
      parent.querySelectorAll(this.controlselector),
    ) as HTMLElement[];
    const newElements = controlElements.filter((elm) => {
      return elm.dataset.ariamanager !== "activated";
    });
    newElements.forEach((elm) => {
      this.bindEvents(elm);
      elm.dataset.ariamanager = "activated";
    });
    this.controlelements = ([] as HTMLElement[]).concat(
      this.controlelements,
      newElements,
    );
  }

  public AriaExpand(target: HTMLElement, value: boolean) {
    if (!target) {
      return;
    }
    this.bindEventsToTargetElements(target);
    target.dispatchEvent(
      this.customEvent("set-aria-expanded", {
        target: target,
        value: value,
      }),
    );
  }

  public AriaHidden(target: HTMLElement, value: boolean) {
    if (!target) {
      return;
    }
    this.bindEventsToTargetElements(target);
    target.dispatchEvent(
      this.customEvent("set-aria-hidden", {
        target: target,
        value: value,
      }),
    );
  }

  public GetARIAControllerFromTarget(target: HTMLElement) {
    const targetid = target.getAttribute("id") + "";
    if (!targetid) {
      return [] as HTMLElement[];
    }
    const relatedControls = this.controlelements.filter((elm) => {
      return (
        (elm.getAttribute("aria-controls") + "")
          .split(" ")
          .indexOf(targetid) !== -1
      );
    });
    return relatedControls;
  }

  public GetARIAControlTargets(element: HTMLElement) {
    const targetselectors = (element.getAttribute("aria-controls") + "").split(
      " ",
    );
    const targets: HTMLElement[] = [];
    const startWith = (stringvalue: string, charvalue: string) =>
      stringvalue.indexOf(charvalue) === 0;
    targetselectors.forEach((selector) => {
      selector =
        (!startWith(selector, "#") && !startWith(selector, ".") ? "#" : "") +
        selector;
      const target = document.querySelector(selector);
      if (target) {
        targets.push(target as HTMLElement);
      }
    });
    return targets;
  }

  private onButtonClick(elm: HTMLElement) {
    const delay = this.getDelayValue(elm);
    elm.dispatchEvent(
      this.customEvent("beforeClick", {
        delay: delay,
        elm: elm,
      }),
    );
    window.setTimeout(() => {
      elm.dispatchEvent(
        this.customEvent("adjustTargetStates", {
          elm: elm,
        }),
      );
    }, delay);
  }

  private bindEvents(orgelm: Element) {
    const elm = orgelm as HTMLElement;
    this.bindEventsToControlElements(elm);
    const targets = this.GetARIAControlTargets(elm); // Get target elements from button
    targets.forEach((target) => {
      this.bindEventsToTargetElements(target);
    });
  }

  private bindEventsToTargetElements(target: HTMLElement) {
    if (target.dataset["ariamanager_eventbindings"] === "true") {
      return;
    }
    target.addEventListener(
      "set-aria-hidden",
      this.setAriaHidden.bind(this) as EventListener,
    );
    target.addEventListener(
      "set-aria-expanded",
      this.setAriaExpanded.bind(this) as EventListener,
    );
    target.dataset["ariamanager_eventbindings"] = "true";
  }

  private bindEventsToControlElements(elm: HTMLElement) {
    elm.addEventListener(
      "click",
      this.onButtonClick.bind(this, elm) as EventListener,
    );
    elm.addEventListener(
      "beforeClick",
      this.beforeClickEvent.bind(this, elm) as EventListener,
    );
    elm.addEventListener(
      "adjustTargetStates",
      this.adjustTargetStates.bind(this, elm) as EventListener,
    );
    elm.addEventListener(
      "updateButtonState",
      this.updateButtonState.bind(this, elm) as EventListener,
    );
  }

  private updateButtonState(elm: HTMLElement, e: CustomEvent) {
    const getAttrVal = (attrElm: HTMLElement, attr: string) =>
      attrElm.hasAttribute(attr) ? attrElm.getAttribute(attr) : null;
    const target = e.detail.target as HTMLElement;
    const targetHidden = getAttrVal(target, "aria-hidden");
    if (elm.hasAttribute("aria-pressed")) {
      elm.setAttribute("aria-pressed", (targetHidden === "false") + "");
    }
    if (elm.hasAttribute("aria-expanded")) {
      elm.setAttribute("aria-expanded", (targetHidden === "false") + "");
    }
  }

  private setAriaHidden(e: CustomEvent) {
    const target = e.detail.target as HTMLElement;
    const value = e.detail.value;
    const relatedControls = this.GetARIAControllerFromTarget(target); // Gets controller from target
    target.setAttribute("aria-hidden", value);
    target.dispatchEvent(
      this.customEvent("aria-hidden-change", {
        target: target,
        value: value,
      }),
    );
    relatedControls.forEach((relatedControl) => {
      relatedControl.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: target,
        }),
      );
    });
  }

  private setAriaExpanded(e: CustomEvent) {
    const target = e.detail.target as HTMLElement;
    const value = e.detail.value;
    const relatedControls = this.GetARIAControllerFromTarget(target); // Gets controller from target
    if (target.hasAttribute("data-aria-expanded")) {
      target.setAttribute("data-aria-expanded", value + "");
    }
    target.dispatchEvent(
      this.customEvent("aria-expanded-change", {
        target: target,
        value: value,
      }),
    );
    relatedControls.forEach((relatedControl) => {
      relatedControl.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: target,
        }),
      );
    });
  }

  private beforeClickEvent(elm: HTMLElement, e: Event) {
    if (!elm || !e) {
      return;
    }
  }

  private adjustTargetStates(elm: HTMLElement, e: Event) {
    const targets = this.GetARIAControlTargets(elm); // Get target elements from button
    targets.forEach((target) => {
      if (target.hasAttribute("aria-hidden")) {
        const isHidden = target.getAttribute("aria-hidden") === "true";
        this.AriaHidden(target, !isHidden);
      }
      if (
        elm.hasAttribute("aria-expanded") ||
        target.hasAttribute("data-aria-expanded")
      ) {
        const isHidden = target.getAttribute("aria-hidden") === "true";
        this.AriaExpand(target, !isHidden);
      }
    });
    if (!e) {
      return;
    }
  }

  private getDelayValue(elm: HTMLElement) {
    let delayValue = 0;
    const attributeValue = elm.getAttribute(this.delayAttribute);
    if (typeof attributeValue === "string" && attributeValue.length > 0) {
      const intAttributeValue = parseInt(attributeValue, 10);
      if (!isNaN(intAttributeValue)) {
        delayValue = intAttributeValue;
      }
    }
    return delayValue;
  }

  private customEvent(name: string, details: object) {
    return new CustomEvent(name, {
      detail: details,
    });
  }
}

interface ARIAManagerInitiationOptions {
  parent?: HTMLElement;
  initiateElements?: boolean;
}
