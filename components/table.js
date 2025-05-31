import { newElement } from '../script/utils.js';
import { createIcon } from './!util.js';

// Refactor
export class WTable extends HTMLElement {
  #data = [];
  /** @type {Record<string, string>} */
  #columns = {};
  #sortKey = '';
  #sortOrder = 'asc';
  #pageSize = 10;
  #currentPage = 1;
  #search = '';
  #searchKey = '';

  /** @type {any} */
  #timeout = -1;

  #selected = [];

  constructor() {
    super();

    this.data = [];
    this.selected = [];
    this.columns = {};
  }

  getFilteredData() {
    const data = [...this.#data];

    if (this.#sortKey) {
      data.sort((a, b) => {
        const valA = a[this.#sortKey];
        const valB = b[this.#sortKey];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return this.#sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return this.#sortOrder === 'asc' ? -1 : 1;
        if (strA > strB) return this.#sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data
      .filter((item) => {
        if (!this.#search) return true;
        const search = String(this.#search).toLowerCase();
        const value = String(item[this.#searchKey] || '').toLowerCase();

        return value.includes(search);
      })
      .filter((_, index) => {
        return (
          index >= (this.#currentPage - 1) * this.#pageSize &&
          index < this.#currentPage * this.#pageSize
        );
      });
  }

  connectedCallback() {}

  #render() {
    clearTimeout(this.#timeout);

    const noCheckbox = this.hasAttribute('no-checkbox');

    this.#timeout = setTimeout(() => {
      this.innerHTML = '';

      const filteredData = this.getFilteredData();

      const head = newElement('div', {
        header: '',
        append: [
          noCheckbox
            ? ''
            : newElement('w-checkbox', {
                disabled: filteredData.length === 0,
                checked: this.selected.length > 0,
                indeterminate:
                  this.selected.length > 0 &&
                  filteredData.length !== this.selected.length,
                onchange: (event) => {
                  this.selected = event.target.checked
                    ? filteredData.map((item) => item.id)
                    : [];
                },
              }),
          ...Object.entries(this.#columns).map(([key, value]) => {
            return newElement('div', {
              text: value,
              append: [
                createIcon('material-symbols:arrow-upward-alt', {
                  noobserver: '',
                  shown: key === this.#sortKey,
                  asc: this.#sortOrder === 'asc',
                }),
              ],
              onclick: () => this.sort(key),
            });
          }),
        ],
      });
      const body = newElement('div', {
        body: '',
        append: filteredData.map((item) => {
          return newElement('div', {
            row: '',
            append: [
              noCheckbox
                ? ''
                : newElement('w-checkbox', {
                    checked: this.selected.includes(item.id),
                    onchange: (event) => {
                      if (event.target.checked) this.selected.push(item.id);
                      else
                        this.selected = this.selected.filter(
                          (id) => id !== item.id
                        );
                    },
                  }),
              ...Object.entries(this.#columns).map(([key]) => {
                const newItem =
                  typeof item[key] === 'object'
                    ? item[key]
                    : { text: String(item[key]) };

                return newElement('div', newItem);
              }),
            ],
          });
        }),
        style: `--table-rows: ${this.#pageSize}`,
      });

      const table = newElement('div', {
        table: '',
        append: [head, body],
      });

      const pagination = newElement('div', {
        pagination: '',
        append: [
          newElement('div', {
            text: `Page ${this.#currentPage} of ${this.maxPage()}`,
          }),
          newElement('div', {
            append: [
              newElement('w-button-icon', {
                icon: 'material-symbols:keyboard-arrow-left',
                onclick: () => {
                  this.page -= 1;
                },
              }),
              newElement('w-button-icon', {
                icon: 'material-symbols:keyboard-arrow-right',
                onclick: () => {
                  this.page += 1;
                },
              }),
            ],
          }),
        ],
      });
      this.append(table, pagination);
    });
  }

  get data() {
    return this.#data;
  }

  set data(data) {
    this.selected = [];
    this.#data = new Proxy(data, {
      get: (target, prop) => {
        return target[prop];
      },
      set: (target, prop, value) => {
        target[prop] = value;
        this.#render();
        return true;
      },
    });
    this.#render();
  }

  get columns() {
    return this.#columns;
  }

  maxPage() {
    return Math.max(1, Math.ceil(this.#data.length / this.#pageSize));
  }

  set columns(columns) {
    this.#columns = new Proxy(columns, {
      get: (target, prop) => {
        if (typeof prop !== 'string') return Reflect.get(target, prop);
        return target[prop];
      },
      set: (target, prop, value) => {
        if (typeof prop !== 'string') return Reflect.set(target, prop, value);
        target[prop] = value;
        this.#render();
        return true;
      },
    });
    this.#render();
  }

  get selected() {
    return this.#selected;
  }

  set selected(selected) {
    this.#selected = new Proxy(selected, {
      get: (target, prop) => {
        if (typeof prop !== 'string') return Reflect.get(target, prop);
        return target[prop];
      },
      set: (target, prop, value) => {
        if (typeof prop !== 'string') return Reflect.set(target, prop, value);
        target[prop] = value;
        this.dispatchEvent(new CustomEvent('selected', { detail: target }));
        this.dispatchEvent(new Event('change'));
        this.#render();
        return true;
      },
    });

    this.dispatchEvent(new CustomEvent('selected', { detail: this.#selected }));
    this.dispatchEvent(new Event('change'));
    this.#render();
  }

  get page() {
    return this.#currentPage;
  }

  set page(page) {
    this.#currentPage = Math.min(Math.max(page, 1), this.maxPage());
    this.#render();
  }

  get pageSize() {
    return this.#pageSize;
  }

  set pageSize(pageSize) {
    this.#pageSize = pageSize;
    this.#render();
  }

  /**
   * @param {string} key
   * @param {'asc' | 'desc'} [order]
   */
  sort(key, order) {
    this.#sortOrder = order
      ? order
      : this.#sortKey === key && this.#sortOrder === 'asc'
      ? 'desc'
      : 'asc';
    this.#sortKey = key;
    this.#render();
  }

  search(value, key) {
    this.#search = value;
    this.#searchKey = key;
    this.#render();
  }

  refresh() {
    this.#render();
  }
}

customElements.define('w-table', WTable);
