import { ripple } from '../script/events/ripple.js';
import { newElement } from '../script/utils.js';
import { takeAttribute, createIcon, getInputAttributes } from './!util.js';

export class WSwitch extends HTMLElement {
  input;

  connectedCallback() {
    this.innerHTML = '';

    const indicator = newElement('div', ['thumb']);
    const iconActive = createIcon(takeAttribute(this, 'icon-active'), [
      'checked',
      'noobserver',
    ]);
    const iconInactive = createIcon(takeAttribute(this, 'icon-inactive'), [
      'unchecked',
      'noobserver',
    ]);

    this.input = newElement('input', {
      ...getInputAttributes(this),
      type: 'checkbox',
    });

    indicator.append(iconInactive, iconActive);
    this.append(this.input, indicator);
    this.addEventListener('click', () => this.input.click());
  }
}

customElements.define('w-switch', WSwitch);
