import { ripple } from '../script/events/ripple.js';
import { getParent, newElement } from '../script/utils.js';
import { clickWithSpaceAndEnter, createIcon, takeAttribute } from './!util.js';

export class WButton extends HTMLElement {
  connected = false;

  connectedCallback() {
    if (this.connected) return;
    this.connected = true;

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

    if (this.getAttribute('type') === 'reset') {
      this.addEventListener('click', () => {
        const form = /** @type {HTMLFormElement} */ (getParent(this, 'form'));
        if (form) form.reset();
      });
    }

    this.addEventListener('click', (event) => {
      if (this.hasAttribute('href') && !this.hasAttribute('disabled'))
        window.location.href = this.getAttribute('href') || '#';
    });
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    value
      ? this.setAttribute('disabled', '')
      : this.removeAttribute('disabled');
    this.tabIndex = value ? -1 : 0;
  }
}

export class WDButton extends HTMLElement {
  connected = false;

  connectedCallback() {
    if (this.connected) return;
    this.connected = true;
    const innerHTML = this.innerHTML;

    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const icon2 = createIcon(
      takeAttribute(this, 'right-icon') || 'material-symbols:expand-more'
    );
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
    value
      ? this.setAttribute('disabled', '')
      : this.removeAttribute('disabled');
    this.tabIndex = value ? -1 : 0;
  }
}

export class WButtonIcon extends HTMLElement {
  connected = false;

  connectedCallback() {
    if (this.connected) return;
    this.connected = true;

    const icon = createIcon(takeAttribute(this, 'icon'));
    this.innerHTML = '';
    this.append(icon);
    this.addEventListener('pointerdown', ripple);
    this.addEventListener('keyup', clickWithSpaceAndEnter.bind(this));

    this.addEventListener('click', (event) => {
      if (this.hasAttribute('href') && !this.hasAttribute('disabled'))
        window.location.href = this.getAttribute('href') || '#';
    });

    if (this.getAttribute('type') === 'submit') {
      this.addEventListener('click', () => {
        const form = /** @type {HTMLFormElement} */ (getParent(this, 'form'));
        if (form) form.requestSubmit();
      });
    }

    if (this.getAttribute('type') === 'reset') {
      this.addEventListener('click', () => {
        const form = /** @type {HTMLFormElement} */ (getParent(this, 'form'));
        if (form) form.reset();
      });
    }
  }
}

customElements.define('w-button', WButton);
customElements.define('w-drop-button', WDButton);
customElements.define('w-button-icon', WButtonIcon);

export default WButton;
