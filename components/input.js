import { newElement } from '../script/utils.js';
import { createIcon, getInputAttributes, takeAttribute } from './!util.js';

export class WInput extends HTMLElement {
  /** @type {HTMLInputElement} */
  input;
  connected = false;

  connectedCallback() {
    if (this.connected) return;
    this.connected = true;

    const innerHTML = this.innerHTML;

    this.innerHTML = '';

    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const icon2 = createIcon(takeAttribute(this, 'right-icon'));
    const prefix = takeAttribute(this, 'prefix');
    const suffix = takeAttribute(this, 'suffix');
    const label = takeAttribute(this, 'label') || innerHTML;

    const content = newElement('div');
    const iPrefix = prefix ? newElement('span', { innerHTML: prefix }) : '';
    const iSuffix = suffix ? newElement('span', { innerHTML: suffix }) : '';
    const iLabel = label ? newElement('span', { text: label, label: '' }) : '';

    this.input = /** @type {any} */ (
      newElement('input', getInputAttributes(this))
    );

    content.append(iLabel, iPrefix, this.input, iSuffix);

    this.append(icon1, content, icon2);
    this.addEventListener('click', () => this.input.focus());

    this.input.addEventListener('change', () =>
      this.dispatchEvent(new Event('change'))
    );

    this.input.addEventListener('input', () =>
      this.dispatchEvent(new Event('input'))
    );
  }

  get value() {
    return this.input.value;
  }

  set value(value) {
    this.input.value = value;
  }
}

export class WInputPass extends HTMLElement {
  /** @type {HTMLInputElement} */
  input;
  /** @type {HTMLElement } */
  visible;

  connected = false;

  connectedCallback() {
    if (this.connected) return;
    this.connected = true;

    const innerHTML = this.innerHTML;

    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const label = takeAttribute(this, 'label') || innerHTML;

    const content = newElement('div');
    const iLabel = label
      ? newElement('span', { innerHTML: label, label: '' })
      : '';

    this.visible = /** @type {any} */ (
      createIcon('material-symbols:visibility-outline', ['eye'])
    );

    this.input = /** @type {any} */ (
      newElement('input', {
        ...getInputAttributes(this),
        type: 'password',
      })
    );

    content.append(iLabel, this.input);

    this.innerHTML = '';

    this.append(icon1, content, this.visible);
    this.addEventListener('click', () => this.input.focus());
    this.visible.onclick = () => this.toggleShow();
  }

  toggleShow() {
    switch (this.input.type) {
      case 'password':
        this.input.type = 'text';
        this.visible.setAttribute(
          'icon',
          'material-symbols:visibility-off-outline'
        );
        break;
      case 'text':
        this.input.type = 'password';
        this.visible.setAttribute(
          'icon',
          'material-symbols:visibility-outline'
        );
        break;
    }
  }

  get value() {
    return this.input.value;
  }

  set value(value) {
    this.input.value = value;
  }
}

export class WInputDivider extends HTMLElement {}

customElements.define('w-input', WInput);
customElements.define('w-input-pass', WInputPass);
customElements.define('w-input-divider', WInputDivider);

export default WInput;
