import { ripple } from '../script/events/ripple.js';
import { bindAttrs, newElement } from '../script/utils.js';

export function createIcon(icon, attrs = {}) {
  if (!icon) return '';

  const element = newElement('iconify-icon', attrs);
  bindAttrs(element, { icon });
  return element;
}

/**
 * @param {HTMLElement} input
 * @param {string} name
 */
export function takeAttribute(input, name) {
  const value = input.getAttribute(name);
  input.removeAttribute(name);
  return value;
}

/**
 * @param {HTMLElement} element
 */
export function getInputAttributes(element) {
  return {
    type: element.getAttribute('type') || 'text',
    name: element.getAttribute('name'),
    placeholder: element.getAttribute('placeholder') || ' ',
    autocomplete: element.getAttribute('autocomplete'),
    pattern: element.getAttribute('pattern'),
    title: element.getAttribute('title'),

    value: element.getAttribute('value'),
    checked: element.getAttribute('checked'),

    maxlength: element.getAttribute('maxlength'),
    minlength: element.getAttribute('minlength'),
    min: element.getAttribute('min'),
    max: element.getAttribute('max'),

    step: element.getAttribute('step'),
    required: element.getAttribute('required'),
    disabled: element.getAttribute('disabled'),
  };
}

/**
 * @param {KeyboardEvent} event
 * @param {HTMLElement | null} [target]
 */
export function clickWithSpaceAndEnter(event, target) {
  if (event.key === ' ' || event.key === 'Enter') {
    /** @type {any} */ (event.currentTarget).click();
    ripple(event, target);
  }
}
