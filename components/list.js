import { ripple } from '../script/events/ripple.js';

export class WList extends HTMLElement {}

export class WListItem extends HTMLElement {
  connectedCallback() {
    this.addEventListener('pointerdown', ripple);

    this.addEventListener('click', (event) => {
      if (this.hasAttribute('href') && !this.hasAttribute('disabled'))
        window.location.href = this.getAttribute('href') || '#';
    });
  }
}

customElements.define('w-list', WList);
customElements.define('w-list-item', WListItem);
