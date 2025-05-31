import { ripple } from '../script/events/ripple.js';
import { Interactive, Setup } from './!mixins.js';

export class WList extends HTMLElement {}

export class WListItem extends Interactive {
  setup() {
    super.setup();
    this.addEventListener('pointerdown', ripple);
    this.replaceChildren(...this.nodes);
  }
}

customElements.define('w-list', WList);
customElements.define('w-list-item', WListItem);
