import { newElement } from '../script/utils.js';
import { createIcon, getInputAttributes, takeAttribute } from './!util.js';

export class WInput extends HTMLElement {
  input;

  constructor() {
    super();
  }

  connectedCallback() {
    const innerHTML = this.innerHTML;

    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const icon2 = createIcon(takeAttribute(this, 'right-icon'));
    const prefix = takeAttribute(this, 'prefix');
    const suffix = takeAttribute(this, 'suffix');
    const label = takeAttribute(this, 'label') || innerHTML;

    const content = newElement('div');
    const iPrefix = prefix ? newElement('span', { innerHTML: prefix }) : '';
    const iSuffix = suffix ? newElement('span', { innerHTML: suffix }) : '';
    const iLabel = label ? newElement('span', { innerHTML: label }) : '';

    this.input = newElement('input', getInputAttributes(this));

    iLabel && iLabel.classList.add('w-input-label');
    content.append(iLabel, iPrefix, this.input, iSuffix);

    this.innerHTML = '';

    this.append(icon1, content, icon2);
    this.addEventListener('click', () => this.input.focus());
  }
}

export class WInputPass extends HTMLElement {
  input;
  visible;

  constructor() {
    super();
  }

  connectedCallback() {
    const innerHTML = this.innerHTML;

    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const label = takeAttribute(this, 'label') || innerHTML;

    const content = newElement('div');
    const iLabel = label ? newElement('span', { innerHTML: label }) : '';

    this.visible = createIcon('material-symbols:visibility-outline', { eye: '' });
    this.input = newElement('input', {
      ...getInputAttributes(this),
      type: 'password',
    });

    iLabel && iLabel.classList.add('w-input-label');
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
        this.visible.setAttribute('icon', 'material-symbols:visibility-off-outline');
        break;
      case 'text':
        this.input.type = 'password';
        this.visible.setAttribute('icon', 'material-symbols:visibility-outline');
        break;
    }
  }
}

customElements.define('w-input', WInput);
customElements.define('w-input-pass', WInputPass);

export default WInput;
