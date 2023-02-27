export default class AriaManager {
    private controlelements;
    private controlselector;
    private delayAttribute;
    constructor(parent?: HTMLElement);
    InitiateElements(parent?: HTMLElement): void;
    AriaExpand(target: HTMLElement, value: boolean): void;
    AriaHidden(target: HTMLElement, value: boolean): void;
    GetARIAControllerFromTarget(target: HTMLElement): HTMLElement[];
    GetARIAControlTargets(element: HTMLElement): HTMLElement[];
    private onButtonClick;
    private bindEvents;
    private bindEventsToTargetElements;
    private bindEventsToControlElements;
    private updateButtonState;
    private setAriaHidden;
    private setAriaExpanded;
    private beforeClickEvent;
    private adjustTargetStates;
    private getDelayValue;
    private customEvent;
}
