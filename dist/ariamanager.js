var l = Object.defineProperty;
var u = (r, t, e) => t in r ? l(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var d = (r, t, e) => (u(r, typeof t != "symbol" ? t + "" : t, e), e);
class h {
  constructor(t) {
    d(this, "controlelements", []);
    d(this, "controlselector", "[aria-controls]:not([data-ariamanager-ignore])");
    d(this, "delayAttribute", "data-ariamanager-delay");
    const e = this.parseOptions(t);
    e.initiateElements && (this.InitiateElements(e.parent), window.addEventListener("global-markupchange", (a) => {
      var n;
      this.InitiateElements(((n = a == null ? void 0 : a.detail) == null ? void 0 : n.target) ?? document);
    }));
  }
  parseOptions(t) {
    const e = { parent: document.body, initiateElements: !0 };
    return !t || typeof t != "object" || typeof t.parent > "u" && typeof t.initiateElements > "u" ? e : { ...e, ...t };
  }
  InitiateElements(t = document.body) {
    const a = [].slice.call(
      t.querySelectorAll(this.controlselector)
    ).filter((n) => n.dataset.ariamanager !== "activated");
    a.forEach((n) => {
      this.bindEvents(n), n.dataset.ariamanager = "activated";
    }), this.controlelements = [].concat(
      this.controlelements,
      a
    );
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
    const e = t.getAttribute("id") + "";
    return e ? (console.log("this.controlelements", this.controlelements), this.controlelements.filter((n) => (n.getAttribute("aria-controls") + "").split(" ").indexOf(e) !== -1)) : [];
  }
  GetARIAControlTargets(t) {
    const e = (t.getAttribute("aria-controls") + "").split(
      " "
    ), a = [], n = (i, s) => i.indexOf(s) === 0;
    return e.forEach((i) => {
      i = (!n(i, "#") && !n(i, ".") ? "#" : "") + i;
      const s = document.querySelector(i);
      s && a.push(s);
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
    this.bindEventsToControlElements(e), this.GetARIAControlTargets(e).forEach((n) => {
      this.bindEventsToTargetElements(n);
    });
  }
  bindEventsToTargetElements(t) {
    t.dataset.ariamanager_eventbindings !== "true" && (t.addEventListener("set-aria-hidden", this.setAriaHidden.bind(this)), t.addEventListener(
      "set-aria-expanded",
      this.setAriaExpanded.bind(this)
    ), t.dataset.ariamanager_eventbindings = "true");
  }
  bindEventsToControlElements(t) {
    t.addEventListener("click", this.onButtonClick.bind(this, t)), t.addEventListener("beforeClick", this.beforeClickEvent.bind(this, t)), t.addEventListener(
      "adjustTargetStates",
      this.adjustTargetStates.bind(this, t)
    ), t.addEventListener(
      "updateButtonState",
      this.updateButtonState.bind(this, t)
    );
  }
  updateButtonState(t, e) {
    console.log("updateButtonState(elm", t);
    const a = (s, o) => s.hasAttribute(o) ? s.getAttribute(o) : null, n = e.detail.target, i = a(n, "aria-hidden");
    t.hasAttribute("aria-pressed") && t.setAttribute("aria-pressed", (i === "false") + ""), t.hasAttribute("aria-expanded") && t.setAttribute("aria-expanded", (i === "false") + "");
  }
  setAriaHidden(t) {
    const e = t.detail.target, a = t.detail.value, n = this.GetARIAControllerFromTarget(e);
    e.setAttribute("aria-hidden", a), e.dispatchEvent(
      this.customEvent("aria-hidden-change", {
        target: e,
        value: a
      })
    ), console.log("relatedControls", e, n), n.forEach((i) => {
      i.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: e
        })
      );
    });
  }
  setAriaExpanded(t) {
    const e = t.detail.target, a = t.detail.value, n = this.GetARIAControllerFromTarget(e);
    e.hasAttribute("data-aria-expanded") && e.setAttribute("data-aria-expanded", a + ""), e.dispatchEvent(
      this.customEvent("aria-expanded-change", {
        target: e,
        value: a
      })
    ), n.forEach((i) => {
      i.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: e
        })
      );
    });
  }
  beforeClickEvent(t, e) {
  }
  adjustTargetStates(t, e) {
    this.GetARIAControlTargets(t).forEach((n) => {
      if (n.hasAttribute("aria-hidden")) {
        const i = n.getAttribute("aria-hidden") === "true";
        this.AriaHidden(n, !i);
      }
      if (t.hasAttribute("aria-expanded") || n.hasAttribute("data-aria-expanded")) {
        const i = n.getAttribute("aria-hidden") === "true";
        this.AriaExpand(n, !i);
      }
    });
  }
  getDelayValue(t) {
    let e = 0;
    const a = t.getAttribute(this.delayAttribute);
    if (typeof a == "string" && a.length > 0) {
      const n = parseInt(a, 10);
      isNaN(n) || (e = n);
    }
    return e;
  }
  customEvent(t, e) {
    return new CustomEvent(t, {
      detail: e
    });
  }
}
export {
  h as default
};
