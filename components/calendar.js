import { newElement } from '../script/utils.js';
import { createIcon } from './!util.js';

export class WCalendar extends HTMLElement {
  month = new Date().getMonth();
  year = new Date().getFullYear();

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = '';

    const calendarHeader = newElement('div', ['header']);
    const calendarBody = newElement('div', ['body']);

    const monthYear = newElement('span', {
      innerHTML: `${this.getMonthName()} ${this.year}`,
    });

    const clickable = newElement('span', {
      clickable: '',
      append: [
        createIcon('material-symbols:keyboard-arrow-left', { onclick: () => this.changeMonth(-1) }),
        createIcon('material-symbols:keyboard-arrow-right', { onclick: () => this.changeMonth(1) }),
      ],
    });

    calendarHeader.append(monthYear, clickable);

    const calendarWeeks = newElement('div', {
      weeks: '',
      append: ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) =>
        newElement('span', { innerHTML: day })
      ),
    });

    calendarBody.append(calendarWeeks, this.renderDays());

    this.append(calendarHeader, calendarBody);
  }

  getMonthName() {
    return new Date(this.year, this.month).toLocaleString('default', { month: 'long' });
  }

  changeMonth(delta) {
    this.month += delta;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    } else if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    this.connectedCallback();
  }

  renderDays() {
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = this.month === today.getMonth() && this.year === today.getFullYear();

    const container = newElement('div', ['days']);

    // Previous month days
    const prevMonth = this.month === 0 ? 11 : this.month - 1;
    const prevYear = this.month === 0 ? this.year - 1 : this.year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const date = daysInPrevMonth - i;
      container.append(
        newElement('span', {
          innerHTML: date,
          other: '',
        })
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const span = newElement('span', {
        innerHTML: day,
        ...(isToday ? { active: '' } : {}),
      });
      container.append(span);
    }

    // Fill the rest of the week with next month days
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      container.append(
        newElement('span', {
          innerHTML: i,
          other: '',
        })
      );
    }

    return container;
  }
}

customElements.define('w-calendar', WCalendar);
