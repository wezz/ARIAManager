export default class AriaManager {
  constructor(parent: HTMLElement);
  InitiateElements(parent: HTMLElement): void;
  AriaExpand(target: HTMLElement, value: boolean): void;
  AriaHidden(target: HTMLElement, value: boolean): void;
  GetARIAControllerFromTarget(target: HTMLElement): HTMLElement[];
  GetARIAControlTargets(target: HTMLElement): HTMLElement[];
}
export interface AriaManagerClass {
  constructor(parent: HTMLElement): void;
  InitiateElements(parent: HTMLElement): void;
  AriaExpand(target: HTMLElement, value: boolean): void;
  AriaHidden(target: HTMLElement, value: boolean): void;
  GetARIAControllerFromTarget(target: HTMLElement): HTMLElement[];
  GetARIAControlTargets(target: HTMLElement): HTMLElement[];
}
