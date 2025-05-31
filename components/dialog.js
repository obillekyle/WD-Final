import { Setup } from './!mixins.js';
import { newElement } from '../script/utils.js';
import { createIcon, takeAttribute } from './!util.js';

export class WDialog extends Setup {
  setup() {
    super.setup();

    const icon = takeAttribute(this, 'icon');
    const title = takeAttribute(this, 'title');
    const closeable = this.hasAttribute('closeable');

    const content = newElement('div', {
      content: '',
      append: [
        createIcon(icon, ['top-icon']),
        newElement('div', { header: '', text: title }),
        newElement('div', { body: '', append: this.nodes }),
        newElement('div', { actions: '', append: this.slots.actions }),
      ],
    });

    setTimeout(() => this.setAttribute('open', ''), 20);

    this.replaceChildren(content);

    for (const button of this.slots.actions) {
      if (button instanceof HTMLElement)
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

/**
 * @typedef {Object} DialogOptions
 * @prop {string} icon
 * @prop {string} title
 * @prop {boolean} closeable
 * @prop {string | Node | (string | Node)[]} content
 * @prop {(string | Node)[]} actions
 */

/** @param {Partial<DialogOptions>} options */
export function openDialog({ icon, title, closeable, content, actions } = {}) {
  document.body.append(
    newElement('w-dialog', {
      icon,
      title,
      closeable,
      append: [
        ...(Array.isArray(content) ? content : [content]),
        newElement('template', { name: 'actions', append: actions }),
      ],
    })
  );
}
