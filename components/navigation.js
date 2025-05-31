import { ripple } from '../script/events/ripple.js';
import { newElement } from '../script/utils.js';
import { Interactive } from './!mixins.js';
import { createIcon, takeAttribute } from './!util.js';

export class WNavigation extends HTMLElement {}

export class WNavigationItem extends Interactive {
  bindActive() {
    const matchString = this.getAttribute('match');

    if (matchString) {
      const matcher = new RegExp(matchString);
      this.classList.toggle('active', matcher.test(window.location.href));
    }
  }

  setup() {
    super.setup();

    const icon = createIcon(takeAttribute(this, 'icon'), ['indicator']);
    const text = newElement('span', { append: this.nodes, label: '' });

    this.disabled = this.hasAttribute('disabled');

    this.replaceChildren(icon, text);
    this.bindActive();

    this.addEventListener('pointerdown', ripple);
    window.addEventListener('locationchange', this.bindActive.bind(this));
  }
}

export class WNavigationList extends HTMLElement {}

customElements.define('w-navigation', WNavigation);
customElements.define('w-navigation-item', WNavigationItem);
customElements.define('w-navigation-list', WNavigationList);
