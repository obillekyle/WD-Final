import { ripple } from '../script/events/ripple.js';
import { newElement } from '../script/utils.js';
import { createIcon, getInputAttributes, takeAttribute } from './!util.js';

/**
 * @typedef {Object} DropdownItem
 * @prop {string} [label]
 * @prop {string} [icon]
 * @prop {string} value
 * @prop {boolean} [disabled]
 */

export class WDropdown extends HTMLElement {
  /**
   * @type {DropdownItem[]}
   */
  #options = [];

  /** @type {any} */
  #renderId = -1;
  #checked = -1;

  /** @type {HTMLElement[]} */
  #elements = [];

  #optionContainer = newElement('div', ['options']);
  #othersContainer = newElement('div', ['others']);
  #selectContainer = newElement('div', ['select']);

  /** @type {HTMLElement | ''} */
  #firstIcon;
  #replacedIcon;

  /** @type {HTMLInputElement} */
  input;

  /** @type {HTMLElement} */
  display;

  constructor() {
    super();

    this.options = [];
  }

  connectedCallback() {
    const innerHTML = this.innerHTML;

    this.innerHTML = '';
    this.#firstIcon = createIcon(takeAttribute(this, 'icon'), ['left-icon']);

    this.display = newElement('span', ['display']);
    const icon2 = createIcon('material-symbols:expand-more', ['expand']);

    const prefix = takeAttribute(this, 'prefix');
    const suffix = takeAttribute(this, 'suffix');
    const label = takeAttribute(this, 'label');

    this.#othersContainer.innerHTML = innerHTML;

    this.input = /** @type {any} */ (
      newElement('input', {
        ...getInputAttributes(this),
        type: 'text',
        onchange: (event) => {
          this.value = /** @type {any} */ (event.target).value;
        },
        onfocus: () => this.toggleAttribute('open', true),
        onblur: () => this.toggleAttribute('open', false),
      })
    );

    const content = newElement('div');
    const iPrefix = prefix ? newElement('span', { html: prefix }) : '';
    const iSuffix = suffix ? newElement('span', { html: suffix }) : '';
    const iLabel = label ? newElement('span', { html: label, label: '' }) : '';

    content.append(iLabel, iPrefix, this.display, this.input, iSuffix);

    this.#selectContainer.append(this.#firstIcon, content, icon2);
    this.#othersContainer.innerHTML = innerHTML;

    this.input.tabIndex = -1;

    this.append(
      this.#selectContainer,
      this.#optionContainer,
      this.#othersContainer
    );

    this.addEventListener('click', () => this.toggleAttribute('open'));
  }

  #setChecked() {
    for (const element of this.#elements) {
      element.removeAttribute('checked');
      this.#replacedIcon?.remove();
    }

    this.display.innerHTML = '';

    const checked = this.#options[this.#checked];

    if (!checked) return;

    this.#elements[this.#checked]?.setAttribute('checked', '');
    this.display.innerHTML = checked.label || checked.value;

    if (checked.icon) {
      this.#replacedIcon = createIcon(checked.icon, ['replaced']);
      this.#selectContainer.insertBefore(
        this.#replacedIcon,
        this.#selectContainer.firstChild
      );
    }
  }

  #render() {
    clearTimeout(this.#renderId);
    this.#renderId = setTimeout(() => {
      this.#elements = [];
      this.#optionContainer.innerHTML = '';

      if (!this.input.required) {
        this.#optionContainer.append(
          newElement('div', {
            option: '',
            onclick: () => {
              this.value = '';
            },
            onpointerdown: ripple,
          })
        );
      }

      this.#options.forEach((option, index) => {
        this.#elements[index] = newElement('div', {
          option: '',
          disbled: option.disabled,
          checked: index === this.#checked,

          append: [
            createIcon(option.icon),
            newElement('span', { html: option.label || option.value }),
          ],

          onclick: () => {
            this.value = option.value;
          },
          onpointerdown: ripple,
        });
      });

      this.#optionContainer.append(...this.#elements);
      this.#setChecked();
    });
  }

  get options() {
    return this.#options;
  }

  set options(value) {
    this.#options = new Proxy(value, {
      get: (target, property) => target[property],
      set: (target, property, value) => {
        target[property] = value;
        this.#render();
        return true;
      },
    });

    this.#render();
  }

  get value() {
    return this.#options[this.#checked]?.value || '';
  }

  set value(value) {
    const newValue = String(value);
    this.#checked = this.#options.findIndex(
      (option) => option.value === newValue
    );

    console.log(value);
    this.input.value = this.#options[this.#checked]?.value || '';
    this.#setChecked();

    this.dispatchEvent(new Event('change'));
  }
}

export class WOption extends HTMLElement {
  connectedCallback() {
    const innerHTML = this.innerHTML;
    const parent = this.closest('w-dropdown') || this.closest('w-select');

    if (!(parent instanceof WDropdown)) return;

    const label = takeAttribute(this, 'label') || innerHTML;
    const icon = takeAttribute(this, 'icon') || undefined;
    const value = takeAttribute(this, 'value') || '';
    const checked = this.hasAttribute('checked');
    const disabled = this.hasAttribute('disabled');

    const data = {
      label,
      icon,
      value,
      disabled,
    };

    parent.options.push(data);
    if (checked) parent.value = value;
    this.remove();
  }
}

customElements.define('w-dropdown', WDropdown);
customElements.define('w-select', class extends WDropdown {});
customElements.define('w-option', WOption);
