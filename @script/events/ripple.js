import { getClientPos, isInteractiveEvent, newElement } from '../utils.js';

/** @this {HTMLElement} */
function removeRipple() {
  this.classList.add('fade');
  this.addEventListener('animationend', () => setTimeout(this.remove.bind(this), 400), {
    once: true,
  });
}

/** @param {HTMLElement} ripple */
function addRippleListener(ripple) {
  addEventListener('pointerup', removeRipple.bind(ripple), { once: true });
  addEventListener('pointercancel', removeRipple.bind(ripple), { once: true });
}

/**
 * @param {MouseEvent | TouchEvent | KeyboardEvent} event
 * @param {HTMLElement | null} [target]
 */
export function ripple(event, target = undefined) {
  target ??= /** @type {any} */ (event.currentTarget);

  if (!(target instanceof HTMLElement)) return;

  const { top, left, height, width } = target.getBoundingClientRect();
  const { x, y } = getClientPos(event);

  const ripple = newElement('span', {
    class: 'w-ripple',
    style: {
      left: x - left + 'px',
      top: y - top + 'px',
      width: (height > width ? height : width) + 'px',
    },
  });

  isInteractiveEvent(event)
    ? addRippleListener(ripple)
    : setTimeout(removeRipple.bind(ripple), 200);

  target.appendChild(ripple);
}
