/**
 * Gets the input value
 *
 * @param {string} inputName
 * @param {string} [defaultValue]
 * @returns {string}
 */
export function getInputValue(inputName, defaultValue = '') {
  return (
    /** @type {HTMLInputElement} */
    (q$(`input[name="${inputName}"]`)).value || defaultValue
  );
}

/**
 * @typedef {Object} HasQuerySelector
 * @property {(selector: string) => any} querySelector
 * /

/**
 * Shorthand for document.querySelector
 *
 * @param {string} selector
 * @param {HasQuerySelector} [root]
 * @returns {HTMLElement | undefined}
 */
export function q$(selector, root = document) {
  return /** @type {any} */ (root.querySelector(selector) ?? undefined);
}

/**
 * Asserted shorthand for document.querySelector
 *
 * @param {string} selector
 * @param {HasQuerySelector} [root]
 * @returns {HTMLElement}
 */
export function aQ$(selector, root = document) {
  return /** @type {any} */ (root.querySelector(selector));
}

/**
 * @param {string} id
 * @returns {HTMLTemplateElement | undefined}
 */
export function getTemplate(id) {
  return /** @type {any} */ (q$('template#' + id)) ?? undefined;
}

/**
 * Shorthand for document.querySelectorAll
 *
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
export function qAll$(selector) {
  return /** @type {any} */ (Array.from(document.querySelectorAll(selector)));
}

/**
 * @typedef TemplateString
 * @type {{
 *     raw: readonly string[] | ArrayLike<string>
 *   } | string
 * }
 */ /**
 * @param {TemplateString} str
 * @param {any[]} args
 * @returns {string}
 */
export function fromRaw(str, ...args) {
  return typeof str === 'string' ? str : String.raw(str, ...args);
}

/**
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 * @returns {string}
 */
export function html(strings, ...values) {
  return fromRaw(strings, ...values)
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<object | undefined>}
 *
 */

export async function getJSON(url, options = {}) {
  const response = await fetch(url, options);
  return response.ok ? response.json() : undefined;
}
/**
 * Generates a random integer between `min` and `max` (inclusive) using an optional seed.
 *
 * @param {number} min - The minimum number.
 * @param {number} max - The maximum number.
 * @param {string | number} [seed] - The seed for the random number generator.
 * @returns {number}
 */
export function rand(min, max, seed = '') {
  let h = 2166136261 >>> 0;
  const seedStr = String(seed);
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  h += h << 13;
  h ^= h >>> 7;
  h += h << 3;
  h ^= h >>> 17;
  h += h << 5;

  const normalized = (h >>> 0) / 2 ** 32;

  return Math.floor(normalized * (max - min + 1)) + min;
}

/**
 * @typedef {Object} Position
 * @prop {number} x
 * @prop {number} y
 *
 */

export function isInteractiveEvent(event) {
  return (
    event instanceof MouseEvent || event instanceof TouchEvent || event instanceof PointerEvent
  );
}

/**
 * Returns the position of the event
 * @param {Event} event
 * @returns {Position}
 */
export function getClientPos(event) {
  if (isInteractiveEvent(event)) {
    return 'changedTouches' in event
      ? {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY,
        }
      : { x: event.clientX, y: event.clientY };
  }

  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) return { x: 0, y: 0 };

  const { top, left, height, width } = target.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
}

/**
 * Creates a new element with attributes
 * @param {string} tagName
 * @param {Record<string, any> | string[]} [attributes]
 * @returns
 */
export function newElement(tagName, attributes = {}) {
  const element = document.createElement(tagName);
  bindAttrs(element, attributes);
  return element;
}

/**
 * Binds attributes to an element
 * @template {HTMLElement} E
 * @param {E} element
 * @param {Record<string, any> | string[]} attributes
 * @returns {E}
 */

export function bindAttrs(element, attributes) {
  attributes = Array.isArray(attributes)
    ? Object.fromEntries(attributes.map((attr) => [attr, '']))
    : attributes;

  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined || value === null) continue;

    if (key.startsWith('on')) {
      element.addEventListener(key.slice(2).toLowerCase(), value);
      continue;
    }

    switch (key) {
      case 'append': {
        if (!Array.isArray(value)) continue;
        element.append(...value);
        continue;
      }

      case 'innerHTML':
      case 'innerText':
      case 'textContent': {
        element[key] = String(value);
        continue;
      }

      case 'style': {
        if (typeof value === 'object') {
          Object.assign(element.style, value);
          continue;
        }

        element.style.cssText = String(value);
        continue;
      }

      case 'dataset': {
        Object.assign(element.dataset, String(value));
        continue;
      }

      case 'class':
      case 'className': {
        element.className = String(value);
        continue;
      }
    }

    element.setAttribute(key, String(value));
  }

  return element;
}

/**
 * @param {number} itemCount
 * @param {string | any[]} array
 */
export function getRandomItemsFromArray(itemCount, array) {
  itemCount = itemCount > array.length ? array.length : itemCount;

  const copiedArray = [...array];
  const newArray = [];

  for (let i = 0; i < itemCount; i++) {
    const index = rand(0, copiedArray.length - 1);
    newArray.push(copiedArray[index]);
    copiedArray.splice(index, 1);
  }

  return newArray;
}

/**
 * @param {string} str
 */
export function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * @param {Element} element
 * @param {string} selector
 * @returns {HTMLElement | null}
 */
export function getParent(element, selector) {
  let parent = element.parentElement;
  while (parent) {
    if (parent.matches(selector)) return parent;
    parent = parent.parentElement;
  }
  return null;
}
