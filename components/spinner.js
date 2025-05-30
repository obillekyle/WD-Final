// reference: https://github.com/obillekyle/components/blob/alpha/packages/lib/src/components/Progress/circular-progress.vue

import { assert, bindAttrs, newElement } from '../script/utils.js';

export class WCircularProgress extends HTMLElement {
  attrs = {
    diameter: 48,
    stroke: 5,
    value: Number.POSITIVE_INFINITY,
    rotate: false,
  };

  /** @type {any} */
  rerenderTimeout = null;

  get circle() {
    const { value, diameter, stroke } = this.attrs;
    const hasSpace = value > 6 && value < 85;

    const space = hasSpace ? stroke * 3 : 0;
    const infinite = !Number.isFinite(value) || value < 0;
    const radius = (diameter - stroke) / 2;

    const circumference = 2 * Math.PI * radius;
    const offsetMultiple = infinite ? 20 : 100 - value;

    const bgValue = circumference * value;
    const bgTotal = circumference * space;

    return {
      radius,
      infinite,
      circumference,
      dashOffset: (circumference * offsetMultiple) / 100,
      dash2Offset: (bgValue + bgTotal) / 100,
      dash2Rotate: (360 * (value + space / 2)) / 100,
    };
  }

  static observedAttributes = ['diameter', 'stroke', 'value', 'rotate'];

  initialized = false;

  elements = {
    svg: newElement('svg', {
      svg: '',
      preserveAspectRatio: 'xMidYMid meet',
    }),
    circle: newElement('circle', {
      circle: '',
      cx: '50%',
      cy: '50%',
    }),
    background: newElement('circle', {
      background: '',
      cx: '50%',
      cy: '50%',
    }),
    content: newElement('div', {
      content: '',
    }),
  };

  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    const innerHTML = this.innerHTML;
    this.innerHTML = '';

    this.elements.svg.append(this.elements.circle, this.elements.background);

    this.bindProps();
    this.append(this.elements.svg, this.elements.content);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.initialized) return;
    if (['diameter', 'stroke', 'value', 'rotate'].includes(name)) {
      this.attrs[name] = newValue;
      clearTimeout(this.rerenderTimeout);

      this.rerenderTimeout = setTimeout(() => this.bindProps());
    }
  }

  get value() {
    return this.attrs.value;
  }

  set value(value) {
    this.setAttribute('value', String(value));
  }

  bindProps() {
    if (!this.initialized) return;

    this.attrs = {
      diameter: Number(this.getAttribute('diameter') || this.attrs.diameter),
      stroke: Number(this.getAttribute('stroke') || this.attrs.stroke),
      value: Number(this.getAttribute('value') || this.attrs.value),
      rotate: this.getAttribute('rotate') === 'true',
    };

    bindAttrs(this.elements.svg, {
      svg: '',
      viewbox: `0 0 ${this.attrs.diameter} ${this.attrs.diameter}`,
      height: this.attrs.diameter,
      width: this.attrs.diameter,
      rotate: this.attrs.rotate,
      infinite: this.circle.infinite,
      style: {
        '--stroke-width': this.attrs.stroke,
        '--stroke-dash-array': this.circle.circumference,
        '--stroke-dash-offset': this.circle.dashOffset,
        '--stroke-dash-offset-2': this.circle.dash2Offset,
        '--circle-2-rotate': `${this.circle.dash2Rotate}deg`,
        '--circle-infinite-start': 0.99 * this.circle.circumference,
        '--circle-infinite-end': 0.2 * this.circle.circumference,
      },
    });

    bindAttrs(this.elements.circle, {
      r: this.circle.radius,
    });

    bindAttrs(this.elements.background, {
      r: this.circle.radius,
    });

    bindAttrs(this.elements.content, {
      style: {
        width: `${this.attrs.diameter - this.attrs.stroke * 2}px`,
      },
    });
  }
}

customElements.define('w-circular-progress', WCircularProgress);
