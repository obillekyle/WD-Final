import './functions.js';
import '../components/index.js';

import { ripple } from './events/ripple.js';

window.onpointerdown = function (event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.matches('.ripple')) {
    ripple(event, target);
  }
};
