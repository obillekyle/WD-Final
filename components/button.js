import { ripple } from '../script/events/ripple.js';
import { getParent, newElement } from '../script/utils.js';
import { Interactive } from './!mixins.js';
import { clickWithSpaceAndEnter, createIcon, takeAttribute } from './!util.js';

export class WBaseButton extends Interactive {
  connected = false;

  render() {}

  setup() {
    super.setup();
    this.setAttribute('role', 'button');
    this.addEventListener('pointerdown', ripple);

    this.render();
  }
}

export class WButton extends WBaseButton {
  render() {
    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const icon2 = createIcon(takeAttribute(this, 'right-icon'));
    const content = newElement('span', { append: this.nodes });

    this.append(icon1, content, icon2);
  }
}

export class WDButton extends WBaseButton {
  render() {
    const icon1 = createIcon(takeAttribute(this, 'icon'));
    const icon2 = createIcon(
      takeAttribute(this, 'right-icon') || 'material-symbols:expand-more'
    );
    const content = newElement('span', { append: this.nodes });
    const mainButton = newElement('div', { append: [icon1, content] });

    this.append(mainButton, icon2);
  }
}

export class WButtonIcon extends WBaseButton {
  static get observedAttributes() {
    return ['icon'];
  }

  render() {
    this.append(createIcon(takeAttribute(this, 'icon')));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'icon') {
      this.replaceChildren(createIcon(newValue));
    }
  }
}

customElements.define('w-button', WButton);
customElements.define('w-drop-button', WDButton);
customElements.define('w-button-icon', WButtonIcon);

export default WButton;
