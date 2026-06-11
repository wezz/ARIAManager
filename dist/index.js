var l = Object.defineProperty;
var h = (d, t, e) => t in d ? l(d, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : d[t] = e;
var o = (d, t, e) => h(d, typeof t != "symbol" ? t + "" : t, e);
const s = class s {
  constructor(t) {
    o(this, "controlselector", "[aria-controls]:not([data-ariamanager-ignore])");
    o(this, "delayAttribute", "data-ariamanager-delay");
    o(this, "hideAttribute", "data-ariamanager-hide");
    if (!(typeof document > "u")) {
      if (s.instance)
        return s.instance.applyOptions(t), s.instance;
      s.instance = this, window.addEventListener("global-markupchange", (e) => {
        var a;
        this.InitiateElements(((a = e == null ? void 0 : e.detail) == null ? void 0 : a.target) ?? document);
      }), this.applyOptions(t);
    }
  }
  parseOptions(t) {
    return {
      parent: (t == null ? void 0 : t.parent) ?? document.body,
      initiateElements: (t == null ? void 0 : t.initiateElements) ?? !0
    };
  }
  applyOptions(t) {
    const { parent: e, initiateElements: a } = this.parseOptions(t);
    a && this.InitiateElements(e);
  }
  InitiateElements(t = document.body) {
    Array.from(t.querySelectorAll(this.controlselector)).filter((e) => e.dataset.ariamanager !== "activated").forEach((e) => {
      this.bindEvents(e), e.dataset.ariamanager = "activated";
    });
  }
  AriaExpand(t, e) {
    t && (this.bindEventsToTargetElements(t), t.dispatchEvent(
      this.customEvent("set-aria-expanded", {
        target: t,
        value: e
      })
    ));
  }
  AriaHidden(t, e) {
    t && (this.bindEventsToTargetElements(t), t.dispatchEvent(
      this.customEvent("set-aria-hidden", {
        target: t,
        value: e
      })
    ));
  }
  GetARIAControllerFromTarget(t) {
    const e = t.getAttribute("id") ?? "";
    if (!e)
      return [];
    const a = e.replace(/["\\]/g, "\\$&");
    return Array.from(
      document.querySelectorAll(
        `[aria-controls~="${a}"]:not([data-ariamanager-ignore])`
      )
    );
  }
  GetARIAControlTargets(t) {
    const e = (t.getAttribute("aria-controls") + "").split(
      " "
    ), a = [], i = (n, r) => n.indexOf(r) === 0;
    return e.forEach((n) => {
      n = (!i(n, "#") && !i(n, ".") ? "#" : "") + n;
      const r = document.querySelector(n);
      r && a.push(r);
    }), a;
  }
  onButtonClick(t) {
    const e = this.getDelayValue(t);
    t.dispatchEvent(
      this.customEvent("beforeClick", {
        delay: e,
        elm: t
      })
    ), window.setTimeout(() => {
      t.dispatchEvent(
        this.customEvent("adjustTargetStates", {
          elm: t
        })
      );
    }, e);
  }
  bindEvents(t) {
    const e = t;
    this.bindEventsToControlElements(e), this.GetARIAControlTargets(e).forEach((i) => {
      this.bindEventsToTargetElements(i);
    });
  }
  bindEventsToTargetElements(t) {
    t.dataset.ariamanager_eventbindings !== "true" && (t.addEventListener(
      "set-aria-hidden",
      this.setAriaHidden.bind(this)
    ), t.addEventListener(
      "set-aria-expanded",
      this.setAriaExpanded.bind(this)
    ), t.dataset.ariamanager_eventbindings = "true");
  }
  bindEventsToControlElements(t) {
    t.addEventListener(
      "click",
      this.onButtonClick.bind(this, t)
    ), t.addEventListener(
      "beforeClick",
      this.beforeClickEvent.bind(this, t)
    ), t.addEventListener(
      "adjustTargetStates",
      this.adjustTargetStates.bind(this, t)
    ), t.addEventListener(
      "updateButtonState",
      this.updateButtonState.bind(this, t)
    );
  }
  updateButtonState(t, e) {
    const a = (r, u) => r.hasAttribute(u) ? r.getAttribute(u) : null, i = e.detail.target, n = a(i, "aria-hidden");
    t.hasAttribute("aria-pressed") && t.setAttribute("aria-pressed", n === "false" ? "true" : "false"), t.hasAttribute("aria-expanded") && t.setAttribute("aria-expanded", n === "false" ? "true" : "false");
  }
  setAriaHidden(t) {
    const e = t.detail.target, a = t.detail.value, i = this.GetARIAControllerFromTarget(e);
    e.setAttribute("aria-hidden", a), this.applyHideStrategy(e, a), e.dispatchEvent(
      this.customEvent("aria-hidden-change", {
        target: e,
        value: a
      })
    ), i.forEach((n) => {
      n.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: e
        })
      );
    });
  }
  setAriaExpanded(t) {
    const e = t.detail.target, a = t.detail.value, i = this.GetARIAControllerFromTarget(e);
    e.hasAttribute("data-aria-expanded") && e.setAttribute("data-aria-expanded", a + ""), e.dispatchEvent(
      this.customEvent("aria-expanded-change", {
        target: e,
        value: a
      })
    ), i.forEach((n) => {
      n.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: e
        })
      );
    });
  }
  beforeClickEvent(t, e) {
  }
  adjustTargetStates(t, e) {
    if (!e)
      return;
    this.GetARIAControlTargets(t).forEach((i) => {
      const n = i.getAttribute("aria-hidden") === "true";
      i.hasAttribute("aria-hidden") && this.AriaHidden(i, !n), (t.hasAttribute("aria-expanded") || i.hasAttribute("data-aria-expanded")) && this.AriaExpand(i, n);
    });
  }
  // Opt-in: when a target carries data-ariamanager-hide="inert" (or "hidden"),
  // also toggle that attribute alongside aria-hidden so hidden content leaves
  // the tab order — aria-hidden alone does not remove focusable descendants.
  // No attribute = original aria-only behaviour (backwards compatible).
  // (Markup should set the matching initial inert/hidden state to agree with
  // the initial aria-hidden value.)
  applyHideStrategy(t, e) {
    const a = t.getAttribute(this.hideAttribute);
    a === "inert" ? t.toggleAttribute("inert", e) : a === "hidden" && t.toggleAttribute("hidden", e);
  }
  getDelayValue(t) {
    let e = 0;
    const a = t.getAttribute(this.delayAttribute);
    if (typeof a == "string" && a.length > 0) {
      const i = parseInt(a, 10);
      isNaN(i) || (e = i);
    }
    return e;
  }
  customEvent(t, e) {
    return new CustomEvent(t, {
      detail: e
    });
  }
};
// Single shared instance. The constructor returns this, so every existing
// `new ARIAManager(...)` call site resolves to one manager — one set of event
// bindings, one global-markupchange listener, and one consistent view of
// every control on the page (no per-instance blind spots).
o(s, "instance", null);
let c = s;
export {
  c as default
};
