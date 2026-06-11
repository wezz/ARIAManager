/*
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
  // Single shared instance. The constructor returns this, so every existing
  // `new ARIAManager(...)` call site resolves to one manager — one set of event
  // bindings, one global-markupchange listener, and one consistent view of
  // every control on the page (no per-instance blind spots).
  private static instance: ARIAManager | null = null;
  private controlselector = "[aria-controls]:not([data-ariamanager-ignore])";
  private delayAttribute = "data-ariamanager-delay";
  constructor(options?: ARIAManagerInitiationOptions) {
    if (ARIAManager.instance) {
      // Already built: just (re-)initialise the requested subtree and hand back
      // the shared instance.
      ARIAManager.instance.applyOptions(options);
      return ARIAManager.instance;
    }
    ARIAManager.instance = this;
    window.addEventListener("global-markupchange", ((e: CustomEvent) => {
      this.InitiateElements(e?.detail?.target ?? document);
    }) as EventListener);
    this.applyOptions(options);
  }

  private parseOptions(options?: ARIAManagerInitiationOptions) {
    return {
      parent: options?.parent ?? document.body,
      initiateElements: options?.initiateElements ?? true,
    };
  }

  private applyOptions(options?: ARIAManagerInitiationOptions) {
    const { parent, initiateElements } = this.parseOptions(options);
    if (initiateElements) {
      this.InitiateElements(parent);
    }
  }

  public InitiateElements(parent: ParentNode = document.body) {
    Array.from(parent.querySelectorAll<HTMLElement>(this.controlselector))
      .filter((elm) => elm.dataset.ariamanager !== "activated")
      .forEach((elm) => {
        this.bindEvents(elm);
        elm.dataset.ariamanager = "activated";
      });
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
    const targetid = target.getAttribute("id") ?? "";
    if (!targetid) {
      return [] as HTMLElement[];
    }
    // Query the DOM live rather than maintaining a cached array: no stale
    // detached nodes to leak, and every control pointing at this id is found
    // regardless of when it was added. `~=` matches one space-separated token,
    // which is exactly aria-controls' token-list semantics.
    return Array.from(
      document.querySelectorAll<HTMLElement>(
        `[aria-controls~="${targetid}"]:not([data-ariamanager-ignore])`,
      ),
    );
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
    // NB: use a ternary rather than `(targetHidden === "false") + ""`.
    // Vite 8 / rolldown (oxc) miscompiles `(x === "literal") + ""` into
    // `x + "literal"`, producing values like "falsefalse" at runtime.
    if (elm.hasAttribute("aria-pressed")) {
      elm.setAttribute("aria-pressed", targetHidden === "false" ? "true" : "false");
    }
    if (elm.hasAttribute("aria-expanded")) {
      elm.setAttribute("aria-expanded", targetHidden === "false" ? "true" : "false");
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
    if (!e) {
      return;
    }
    const targets = this.GetARIAControlTargets(elm); // Get target elements from button
    targets.forEach((target) => {
      // Decide the next visible state once, before mutating anything, so the
      // aria-hidden and aria-expanded writes can't disagree. (Previously the
      // expanded write re-read aria-hidden after AriaHidden had already flipped
      // it.)
      const willBeVisible = target.getAttribute("aria-hidden") === "true";
      if (target.hasAttribute("aria-hidden")) {
        this.AriaHidden(target, !willBeVisible);
      }
      if (
        elm.hasAttribute("aria-expanded") ||
        target.hasAttribute("data-aria-expanded")
      ) {
        this.AriaExpand(target, willBeVisible);
      }
    });
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
