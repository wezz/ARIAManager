import { describe, it, expect, beforeEach, vi } from "vitest";
import ARIAManager from "../src/ARIAManager";

// The singleton is a module-level static; reset it between tests so each test
// starts from a clean manager.
const resetSingleton = () => {
  (ARIAManager as unknown as { instance: ARIAManager | null }).instance = null;
};

describe("ARIAManager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    resetSingleton();
    vi.useFakeTimers();
  });

  it("returns the same shared instance (singleton)", () => {
    expect(new ARIAManager()).toBe(new ARIAManager());
  });

  it("toggles aria-hidden / aria-expanded to clean boolean strings (regression: never 'falsefalse')", () => {
    document.body.innerHTML = `
      <button aria-controls="panel" aria-expanded="false">Toggle</button>
      <div id="panel" aria-hidden="true">content</div>`;
    const button = document.querySelector("button")!;
    const panel = document.getElementById("panel")!;
    new ARIAManager();

    button.click();
    vi.runAllTimers();
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    expect(button.getAttribute("aria-expanded")).toBe("true");

    button.click();
    vi.runAllTimers();
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles `inert` when the target opts in via data-ariamanager-hide", () => {
    document.body.innerHTML = `
      <button aria-controls="panel" aria-expanded="false">Toggle</button>
      <div id="panel" aria-hidden="true" data-ariamanager-hide="inert" inert>content</div>`;
    const button = document.querySelector("button")!;
    const panel = document.getElementById("panel")!;
    new ARIAManager();

    button.click();
    vi.runAllTimers();
    expect(panel.hasAttribute("inert")).toBe(false);

    button.click();
    vi.runAllTimers();
    expect(panel.hasAttribute("inert")).toBe(true);
  });

  it("leaves a target alone when it has data-ariamanager-ignore", () => {
    document.body.innerHTML = `
      <button aria-controls="panel" aria-expanded="false" data-ariamanager-ignore>Toggle</button>
      <div id="panel" aria-hidden="true">content</div>`;
    const button = document.querySelector("button")!;
    const panel = document.getElementById("panel")!;
    new ARIAManager();

    button.click();
    vi.runAllTimers();
    // The control is ignored, so nothing is bound and state does not change.
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
});
