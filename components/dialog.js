import { newElement } from '../script/utils.js';
import { createIcon, takeAttribute } from './!util.js';

export class WDialog extends HTMLElement {
  connectedCallback() {
    const icon = takeAttribute(this, 'icon');
    const title = takeAttribute(this, 'title');
    const closeable = this.hasAttribute('closeable');

    const slotButtons = this.querySelector('slot[name="actions"]');
    const buttons = [...(slotButtons?.children || [])];

    slotButtons?.remove();

    const elements = [...this.childNodes];
    console.log(elements);
    this.innerHTML = '';

    const content = newElement('div', {
      content: '',
      append: [
        createIcon(icon, ['top-icon']),
        newElement('div', { header: '', text: title }),
        newElement('div', { body: '', append: elements }),
        newElement('div', { actions: '', append: buttons }),
      ],
    });

    setTimeout(() => this.setAttribute('open', ''), 20);

    this.append(content);

    for (const button of buttons) {
      if (button.matches('[type="close"]'))
        button.addEventListener('click', () => this.close());
    }

    if (closeable) {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.close();
      });
    }
  }

  close() {
    this.removeAttribute('open');
    this.addEventListener('transitionend', () => this.remove(), { once: true });
  }
}

customElements.define('w-dialog', WDialog);
