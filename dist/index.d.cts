declare class ARIAManager {
    private static instance;
    private controlselector;
    private delayAttribute;
    private hideAttribute;
    constructor(options?: ARIAManagerInitiationOptions);
    private parseOptions;
    private applyOptions;
    InitiateElements(parent?: ParentNode): void;
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
    private applyHideStrategy;
    private getDelayValue;
    private customEvent;
}
export = ARIAManager;

declare interface ARIAManagerInitiationOptions {
    parent?: HTMLElement;
    initiateElements?: boolean;
}

