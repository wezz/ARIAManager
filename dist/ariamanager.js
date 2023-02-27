var c = Object.defineProperty;
var u = (r, t, e) => t in r ? c(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var d = (r, t, e) => (u(r, typeof t != "symbol" ? t + "" : t, e), e);
class h {
  constructor(t = document.body) {
    d(this, "controlelements", []);
    d(this, "controlselector", "[aria-controls]:not([data-ariamanager-ignore])");
    d(this, "delayAttribute", "data-ariamanager-delay");
    this.InitiateElements(t), window.addEventListener("global-markupchange", (e) => {
      var n;
      this.InitiateElements(((n = e == null ? void 0 : e.detail) == null ? void 0 : n.target) ?? document);
    });
  }
  InitiateElements(t = document.body) {
    const n = [].slice.call(
      t.querySelectorAll(this.controlselector)
    ).filter((a) => a.dataset.ariamanager !== "activated");
    n.forEach((a) => {
      this.bindEvents(a), a.dataset.ariamanager = "activated";
    }), this.controlelements = [].concat(
      this.controlelements,
      n
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
    return e ? this.controlelements.filter(
      (a) => (a.getAttribute("aria-controls") + "").indexOf(e) !== -1
    ) : [];
  }
  GetARIAControlTargets(t) {
    const e = (t.getAttribute("aria-controls") + "").split(
      " "
    ), n = [], a = (i, s) => i.indexOf(s) === 0;
    return e.forEach((i) => {
      i = (!a(i, "#") && !a(i, ".") ? "#" : "") + i;
      const s = document.querySelector(i);
      s && n.push(s);
    }), n;
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
    this.bindEventsToControlElements(e), this.GetARIAControlTargets(e).forEach((a) => {
      this.bindEventsToTargetElements(a);
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
    const n = (s, o) => s.hasAttribute(o) ? s.getAttribute(o) : null, a = e.detail.target, i = n(a, "aria-hidden");
    t.hasAttribute("aria-pressed") && t.setAttribute("aria-pressed", (i === "false") + ""), t.hasAttribute("aria-expanded") && t.setAttribute("aria-expanded", (i === "false") + "");
  }
  setAriaHidden(t) {
    const e = t.detail.target, n = t.detail.value, a = this.GetARIAControllerFromTarget(e);
    e.setAttribute("aria-hidden", n), e.dispatchEvent(
      this.customEvent("aria-hidden-change", {
        target: e,
        value: n
      })
    ), a.forEach((i) => {
      i.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: e
        })
      );
    });
  }
  setAriaExpanded(t) {
    const e = t.detail.target, n = t.detail.value, a = this.GetARIAControllerFromTarget(e);
    e.hasAttribute("data-aria-expanded") && e.setAttribute("data-aria-expanded", n + ""), e.dispatchEvent(
      this.customEvent("aria-expanded-change", {
        target: e,
        value: n
      })
    ), a.forEach((i) => {
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
    this.GetARIAControlTargets(t).forEach((a) => {
      if (a.hasAttribute("aria-hidden")) {
        const i = a.getAttribute("aria-hidden") === "true";
        this.AriaHidden(a, !i);
      }
      if (t.hasAttribute("aria-expanded") || a.hasAttribute("data-aria-expanded")) {
        const i = a.getAttribute("aria-hidden") === "true";
        this.AriaExpand(a, !i);
      }
    });
  }
  getDelayValue(t) {
    let e = 0;
    const n = t.getAttribute(this.delayAttribute);
    if (typeof n == "string" && n.length > 0) {
      const a = parseInt(n, 10);
      isNaN(a) || (e = a);
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
  h as ARIAManager
};
