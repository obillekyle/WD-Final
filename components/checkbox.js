import { ripple } from '../script/events/ripple.js';
import { newElement } from '../script/utils.js';
import { takeAttribute, createIcon, getInputAttributes, clickWithSpaceAndEnter } from './!util.js';

export class WCheckbox extends HTMLElement {
  input;

  constructor() {
    super();
  }

  connectedCallback() {
    const innerHTML = this.innerHTML;

    const label = takeAttribute(this, 'label') || innerHTML;
    const content = label ? newElement('div', { innerHTML: label }) : '';
    const indicator = newElement('div', { indicator: '' });

    const iconActive = createIcon('mdi:checkbox-marked', ['checked', 'noobserver']);
    const iconInactive = createIcon('mdi:checkbox-blank-outline', ['unchecked', 'noobserver']);

    this.input = newElement('input', {
      ...getInputAttributes(this),
      type: 'checkbox',
    });

    this.innerHTML = '';

    indicator.append(iconInactive, iconActive);
    this.append(this.input, indicator, content);
    this.addEventListener('click', () => this.input.click());
    this.addEventListener('pointerdown', (event) => ripple(event, indicator));
    this.input.addEventListener('keyup', (event) => clickWithSpaceAndEnter(event, indicator));
  }
}

export class WRadio extends HTMLElement {
  input;

  constructor() {
    super();
  }

  connectedCallback() {
    const innerHTML = this.innerHTML;

    const label = takeAttribute(this, 'label') || innerHTML;
    const content = label ? newElement('div', { innerHTML: label }) : '';
    const indicator = newElement('div', { indicator: '' });

    const iconActive = createIcon('mdi:radiobox-marked', ['checked', 'noobserver']);
    const iconInactive = createIcon('mdi:circle-outline', ['unchecked', 'noobserver']);

    this.input = newElement('input', { ...getInputAttributes(this), type: 'radio' });

    this.innerHTML = '';

    indicator.append(iconInactive, iconActive);
    this.append(this.input, indicator, content);
    this.addEventListener('click', () => this.input.click());
    this.addEventListener('pointerdown', (event) => ripple(event, indicator));
    this.input.addEventListener('keyup', (event) => clickWithSpaceAndEnter(event, indicator));
  }
}

customElements.define('w-checkbox', WCheckbox);
customElements.define('w-radio', WRadio);

export default WCheckbox;
