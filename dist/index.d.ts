declare class ARIAManager {
    private controlelements;
    private controlselector;
    private delayAttribute;
    constructor(options?: ARIAManagerInitiationOptions);
    private parseOptions;
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
export default ARIAManager;

declare interface ARIAManagerInitiationOptions {
    parent?: HTMLElement;
    initiateElements?: boolean;
}

export { }
