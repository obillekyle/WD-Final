import { ripple } from '../script/events/ripple.js';

export class WList extends HTMLElement {
  constructor() {
    super();
  }
}

export class WListItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('pointerdown', ripple);
  }
}

customElements.define('w-list', WList);
customElements.define('w-list-item', WListItem);
