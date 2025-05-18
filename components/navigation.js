import { ripple } from '../script/events/ripple.js';
import { newElement } from '../script/utils.js';
import { clickWithSpaceAndEnter, createIcon, takeAttribute } from './!util.js';

export class WNavigation extends HTMLElement {
  constructor() {
    super();
  }
}

export class WNavigationItem extends HTMLElement {
  constructor() {
    super();
  }

  get href() {
    return this.getAttribute('href');
  }

  get target() {
    return this.getAttribute('target');
  }

  bindActive() {
    const matchString = this.getAttribute('match');

    if (!matchString) return;

    const matcher = new RegExp(matchString);
    this.classList.toggle('active', matcher.test(window.location.href));
  }

  connectedCallback() {
    const innerHTML = this.innerHTML;

    const icon = createIcon(takeAttribute(this, 'icon'), ['icon']);
    const text = newElement('span', { innerHTML, label: '' });

    this.innerHTML = '';
    this.disabled = this.hasAttribute('disabled');

    this.append(icon, text);

    this.addEventListener('pointerdown', ripple);
    this.click = () => (window.location.href = this.href || '#');
    this.addEventListener('keyup', clickWithSpaceAndEnter.bind(this));

    this.bindActive();
    window.addEventListener('locationchange', this.bindActive.bind(this));
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
    this.tabIndex = value ? -1 : 0;
  }
}

export class WNavigationList extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('w-navigation', WNavigation);
customElements.define('w-navigation-item', WNavigationItem);
customElements.define('w-navigation-list', WNavigationList);
