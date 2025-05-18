import { ripple } from '../script/events/ripple.js';
import { getParent, newElement } from '../script/utils.js';
import { clickWithSpaceAndEnter, createIcon, takeAttribute } from './!util.js';

export class WButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const innerHTML = this.innerHTML;

    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const icon2 = createIcon(takeAttribute(this, 'right-icon'));
    const content = newElement('span', { innerHTML });

    this.innerHTML = '';
    this.disabled = this.hasAttribute('disabled');

    this.append(icon1, content, icon2);
    this.addEventListener('pointerdown', ripple);
    this.addEventListener('keyup', clickWithSpaceAndEnter.bind(this));

    if (this.getAttribute('type') === 'submit') {
      this.addEventListener('click', () => {
        const form = /** @type {HTMLFormElement} */ (getParent(this, 'form'));
        if (form) form.requestSubmit();
      });
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
    this.tabIndex = value ? -1 : 0;
  }
}

export class WDButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const innerHTML = this.innerHTML;

    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const icon2 = createIcon(takeAttribute(this, 'right-icon') || 'material-symbols:expand-more');
    const content = newElement('span', { innerHTML });

    const mainButton = newElement('div');
    mainButton.append(icon1, content);

    this.innerHTML = '';
    this.disabled = this.hasAttribute('disabled');

    this.append(mainButton, icon2);
    this.addEventListener('pointerdown', ripple);
    this.addEventListener('keyup', clickWithSpaceAndEnter.bind(this));
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
    this.tabIndex = value ? -1 : 0;
  }
}

customElements.define('w-button', WButton);
customElements.define('w-drop-button', WDButton);

export default WButton;
