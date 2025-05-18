import { newElement } from '../script/utils.js';

export class WProgress extends HTMLElement {
  progress;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['value'];
  }

  connectedCallback() {
    this.innerHTML = '';
    this.progress = newElement('div', ['progress']);
    this.style.setProperty('--value', String(this.value));
    this.append(this.progress);
  }

  get value() {
    return Number(this.getAttribute('value') || 0);
  }

  set value(value) {
    this.setAttribute('value', String(value));
  }

  attributeChangedCallback(name) {
    if (name) this.style['--value'] = this.value;
  }
}

customElements.define('w-progress', WProgress);
