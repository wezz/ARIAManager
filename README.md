# ARIA Manager

This is a script that will handle events related to [WAI-ARIA](https://www.w3.org/TR/wai-aria-1.1/) attributes. 
It's most common use is to bind click events to buttons with the [aria-controls] attribute and to toggle the attribute aria-hidden on it's target.
The script acts as a state handler for elements with these attributes. 
If a aria-controls target changes state, the controlling buttons will reflect that state.

## Installation
```
npm install @wezz/ariamanager
```

## Usage
### Initialize ARIA Manager
```
import ARIAManager from "@wezz/ariamanager";
// On document ready
new ARIAManager();
```

### Add WAI-ARIA attributes to markup
```
<button aria-controls="exampletarget1" aria-pressed="false">Open Example target 1</button>
<div id="exampletarget1" class="exampletarget" aria-hidden="true">
</div>
```

## Advanced usage
### Programatic triggers
The ARIA manager is a class with methods so you can programatically toggle elements visibility and the controlling buttons will reflect the targets state.
```
const ariaInstance = new ARIAManager();
// This will set the attribute to the target to be _aria-expanded="true"_. 
// And any button that targets that element and has the aria-pressed attribute will reflect that state.
ariaInstance.AriaExpand(document.getElementById("exampletarget1"), true); 
```

### Adding markup after DOMContentLoaded
If markup has been added to a page after the ARIA Manager has been updated, it is possible to initialize new elements using a global event against the window.

```
window.dispatchEvent(new CustomEvent('global-markupchange', { detail: { target: document.querySelector(".additionalDataContainer") } }));
```

The target in the event is optional, but if a target has been added (as a HTML Element) to the detail data;
Then the ARIA Manager will only search for new elements to bind to within that container.

## Usage in combination of reactive frameworks (ARIA Manager Ignore)
The most common usecase is that the ARIA Manager will run on document ready. 
It is not recommended to use the ARIA Manager within reactive frameworks since the bindings will not re-initialize or get lost when the markup changes. 

But if you have a reactive component that use aria-controls attributes on a page that has ARIA Manager, you can add the attribute _data-ariamanager-ignore_ to the aria-controls elements within the reactive component / app to avoid having ARIA Manager adjusting attributes. 

Vue Example
```
<button 
    aria-controls="myexamplediv" 
    data-ariamanager-ignore
    v-bind:click="this.openState = !this.openState">Toggle</button>
<div id="myexamplediv" v-bind:aria-hidden="(!this.openState)+''">
</div>
```

## Development & Demo
Clone this repo
Run
``` npm install ```

To run the interactive demo, run 
``` npm run demo ```
