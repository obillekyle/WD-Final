import { WDropdown } from '../../components/select.js';
import { timeRows } from '../constants.js';
import {
  checkScheduleConflicts,
  faculties,
  getFacultyName,
  getRoomName,
  getSectionName,
  rooms,
  schedules,
  sections,
  subjects,
} from '../data.js';
import { WEEKDAYS } from '../enums.js';
import { bindAttrs, newElement, q$, qAll$, replaceElement } from '../utils.js';
import './account-setup.js';

const TYPE = Object.freeze({
  ROOM: 'room',
  FACULTY: 'faculty',
  SECTION: 'section',
});

// get search params
const params = new URLSearchParams(window.location.search);
let type = params.get('type') || TYPE.ROOM;
let id = params.get('id') || '';

// define static data
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

// load dropdowns
const facultyInput = /** @type {WDropdown} */ (q$('#facultyInput'));

for (const id in faculties) {
  facultyInput?.append(
    newElement('w-option', {
      value: id,
      text: getFacultyName(id),
    })
  );
}

const roomInput = /** @type {WDropdown} */ (q$('#roomInput'));

for (const id in rooms) {
  roomInput?.append(
    newElement('w-option', {
      value: id,
    })
  );
}

const subjectInput = /** @type {WDropdown} */ (q$('#subjectInput'));

for (const [id, subject] of Object.entries(subjects)) {
  subjectInput?.append(
    newElement('w-option', {
      value: id,
      text: subject.title,
    })
  );
}

const sectionInput = /** @type {WDropdown} */ (q$('#sectionInput'));

for (const id of Object.keys(sections)) {
  sectionInput?.append(
    newElement('w-option', {
      value: id,
      text: getSectionName(id),
    })
  );
}

const dayInput = /** @type {WDropdown} */ (q$('#dayInput'));

for (const [text, value] of Object.entries(WEEKDAYS)) {
  dayInput?.append(
    newElement('w-option', {
      value,
      text,
    })
  );
}

const startInput = /** @type {WDropdown} */ (q$('#startInput'));

for (let i = 0; i < timeRows.length; i++) {
  startInput?.append(
    newElement('w-option', {
      value: i,
      text: timeRows[i],
    })
  );
}

const endInput = /** @type {WDropdown} */ (q$('#endInput'));

for (let i = 0; i < timeRows.length; i++) {
  endInput?.append(
    newElement('w-option', {
      value: i,
      text: timeRows[i],
    })
  );
}

// load clickable chip & update table
updateChips();

function updateChips() {
  const chips = q$('#scheduleChips');

  chips &&
    bindAttrs(chips, {
      html: '',
      append: [
        newElement('w-chip', {
          text: 'Room',
          icon: 'material-symbols:meeting-room-outline',
          variant: type === TYPE.ROOM ? 'filled' : 'outlined',
          onclick: () => {
            type = TYPE.ROOM;
            id = '';
            updateChips();
          },
        }),
        newElement('w-chip', {
          text: 'Faculty',
          icon: 'mdi:teach',
          variant: type === TYPE.FACULTY ? 'filled' : 'outlined',
          onclick: () => {
            type = TYPE.FACULTY;
            id = '';
            updateChips();
          },
        }),
        newElement('w-chip', {
          text: 'Section',
          icon: 'material-symbols:group-outline',
          variant: type === TYPE.SECTION ? 'filled' : 'outlined',
          onclick: () => {
            type = TYPE.SECTION;
            id = '';
            updateChips();
          },
        }),
      ],
    });

  /** @type {WDropdown | null} */
  let dropdown = null;

  switch (type) {
    case TYPE.ROOM:
      {
        const box = q$('#scheduleInput');

        if (box) {
          dropdown = replaceElement(
            box,
            /** @type {WDropdown} */ (
              newElement('w-dropdown', {
                id: 'scheduleInput',
                label: 'Rooms',
                icon: 'material-symbols:meeting-room-outline',
                append: Object.entries(rooms).map(([key, room]) => {
                  return newElement('w-option', {
                    value: key,
                    text: room.name,
                    checked: key === id,
                  });
                }),
              })
            )
          );
        }
      }
      break;
    case TYPE.FACULTY:
      {
        const box = q$('#scheduleInput');

        if (box) {
          dropdown = replaceElement(
            box,
            /** @type {WDropdown} */ (
              newElement('w-dropdown', {
                id: 'scheduleInput',
                label: 'Faculties',
                icon: 'material-symbols:group-outline',
                append: Object.keys(faculties).map((key) => {
                  return newElement('w-option', {
                    value: key,
                    text: getFacultyName(key),
                    checked: key === id,
                  });
                }),
              })
            )
          );
        }
      }
      break;
    case TYPE.SECTION:
      {
        const box = q$('#scheduleInput');

        if (box) {
          dropdown = replaceElement(
            box,
            /** @type {WDropdown} */ (
              newElement('w-dropdown', {
                id: 'scheduleInput',
                label: 'Sections',
                icon: 'material-symbols:group-outline',
                append: Object.keys(sections).map((key) => {
                  return newElement('w-option', {
                    value: key,
                    text: getSectionName(key),
                    checked: key === id,
                  });
                }),
              })
            )
          );
        }
      }
      break;
  }

  dropdown?.addEventListener('change', () => {
    id = dropdown?.value || '';
    updateTable();
  });

  updateTable();
}

// define functions
function resetTable() {
  const table = q$('.sched-table tbody');

  if (!table) return;
  table.innerHTML = '';

  timeRows.forEach((time, index) => {
    const row = newElement('tr', {
      append: [
        newElement('td', { class: 'time', textContent: time }),
        newElement('td', { 'data-column': 0, 'data-row': index }),
        newElement('td', { 'data-column': 1, 'data-row': index }),
        newElement('td', { 'data-column': 2, 'data-row': index }),
        newElement('td', { 'data-column': 3, 'data-row': index }),
        newElement('td', { 'data-column': 4, 'data-row': index }),
        newElement('td', { 'data-column': 5, 'data-row': index }),
      ],
    });
    table.appendChild(row);
  });
}

function updateTable() {
  resetTable();

  switch (type) {
    case TYPE.ROOM:
      updateRoomTable(id);
      break;
    case TYPE.FACULTY:
      updateFacultyTable(id);
      break;
    case TYPE.SECTION:
      updateSectionTable(id);
      break;
  }

  history.pushState(null, '', `?type=${type}&id=${id}`);
}

function updateRoomTable(id) {
  resetTable();

  const table = q$('.sched-table tbody');
  const roomData = schedules[id];

  if (!table || !roomData) return;

  for (const [key, entry] of Object.entries(roomData)) {
    const colIndex = entry.day;
    if (colIndex === undefined) return;

    for (let i = entry.start; i < entry.end; i++) {
      const row = table.children[i];
      const cell = q$(`td[data-column="${colIndex}"]`, row);

      if (i === entry.start && cell) {
        bindAttrs(cell, {
          append: [
            newElement('div', { text: entry.subject.toUpperCase() }),
            newElement('div', { text: getFacultyName(entry.instructor) }),
            newElement('div', { text: getSectionName(entry.section) }),
          ],
        });

        cell.setAttribute('rowspan', String(entry.end - entry.start));
        cell.setAttribute('data', JSON.stringify({ ...entry, room: id }));
        cell.classList.add(colors[Number(key) % colors.length]);
        continue;
      }

      cell?.remove();
    }
  }
}

function updateFacultyTable(id) {
  resetTable();

  const table = q$('.sched-table tbody');
  const facultyData = Object.entries(schedules).flatMap(([room, data]) =>
    data
      .filter((entry) => entry.instructor === Number(id))
      .map((entry) => ({ room, ...entry }))
  );

  if (!table) return;

  for (const [key, entry] of Object.entries(facultyData)) {
    const colIndex = entry.day;
    if (colIndex === undefined) return;

    for (let i = entry.start; i < entry.end; i++) {
      const row = table.children[i];
      const cell = q$(`td[data-column="${colIndex}"]`, row);

      if (i === entry.start && cell) {
        bindAttrs(cell, {
          append: [
            newElement('div', { text: entry.subject.toUpperCase() }),
            newElement('div', { text: getRoomName(entry.room) }),
            newElement('div', { text: getSectionName(entry.section) }),
          ],
        });

        cell.setAttribute('rowspan', String(entry.end - entry.start));
        cell.setAttribute('data', JSON.stringify(entry));
        cell.classList.add(colors[Number(key) % colors.length]);
        continue;
      }

      cell?.remove();
    }
  }
}

function updateSectionTable(id) {
  resetTable();

  const table = q$('.sched-table tbody');
  const sectionData = Object.entries(schedules).flatMap(([room, data]) =>
    data
      .filter((entry) => entry.section === Number(id))
      .map((entry) => ({ room, ...entry }))
  );

  if (!table) return;

  for (const [key, entry] of Object.entries(sectionData)) {
    const colIndex = entry.day;
    if (colIndex === undefined) return;

    for (let i = entry.start; i < entry.end; i++) {
      const row = table.children[i];
      const cell = q$(`td[data-column="${colIndex}"]`, row);

      if (i === entry.start && cell) {
        bindAttrs(cell, {
          append: [
            newElement('div', { text: entry.subject.toUpperCase() }),
            newElement('div', { text: getRoomName(entry.room) }),
            newElement('div', { text: getFacultyName(entry.instructor) }),
          ],
        });

        cell.setAttribute('rowspan', String(entry.end - entry.start));
        cell.setAttribute('data', JSON.stringify(entry));
        cell.classList.add(colors[Number(key) % colors.length]);
        continue;
      }

      cell?.remove();
    }
  }
}

let size = 0;
let column = 0;
let cellStart = -1;
let cellEnd = -1;

let dragging = false;
let startClick = 0;

function getFocusValue() {
  switch (type) {
    case 'room':
      return { room: id };
    case 'faculty':
      return { instructor: id };
    case 'section':
      return { section: id };
  }
}

document.addEventListener('pointerdown', (event) => {
  const target = /** @type {HTMLElement} */ (event.target);

  if (startClick + 200 > Date.now()) {
    if (target.hasAttribute('data')) {
      const data = JSON.parse(target.getAttribute('data') || '{}');
      editData(data);
      return;
    }
    if (target.matches('.selected')) {
      editData({
        day: column,
        start: cellStart,
        end: cellEnd + 1,
        ...getFocusValue(),
      });
      return;
    }
    dragging = true;
  } else {
    startClick = Date.now();
    return false;
  }

  if (target.tagName !== 'TD' || target.matches('.time')) return;

  size = Number(target.getAttribute('rowspan'));
  column = Number(target.getAttribute('data-column'));
  cellStart = Number(target.getAttribute('data-row'));
  cellEnd = cellStart;

  highlightCells();
});

document.addEventListener('pointermove', (event) => {
  if (!dragging) return;

  const target = /** @type {HTMLElement} */ (event.target);

  if (target.tagName !== 'TD' || target.matches('.time')) return;

  const newColumn = Number(target.getAttribute('data-column'));
  const newRow = Number(target.getAttribute('data-row'));
  const rowSize = Number(target.getAttribute('rowspan') || 1);

  if (rowSize > 1) {
    size = rowSize;
    column = newColumn;
    cellStart = newRow;
    cellEnd = cellStart + rowSize - 1;
  } else if (newColumn !== column) {
    column = newColumn;
    cellStart = newRow;
    cellEnd = cellStart;
    size = rowSize;
  } else if (cellStart + 6 > newRow) {
    cellEnd = newRow;
  }

  highlightCells();
});

document.addEventListener('pointerup', () => {
  dragging = false;
  highlightCells();
});

function highlightCells() {
  const old = qAll$('.sched-table td.selected');

  for (const cell of old) {
    cell.classList.remove('selected');
  }

  for (let i = cellStart; i <= cellEnd; i++) {
    const cell = q$(`td[data-column="${column}"][data-row="${i}"]`);

    if (!cell) continue;
    cell.classList.add('selected');
  }
}

function editData(data) {
  const sidebar = /** @type {HTMLFormElement} */ (q$('.sidebar'));

  if (sidebar) {
    sidebar.classList.add('open');

    subjectInput.value = data.subject;
    roomInput.value = data.room;
    facultyInput.value = data.instructor;
    sectionInput.value = data.section;
    startInput.value = data.start;
    endInput.value = data.end;
    dayInput.value = data.day;

    sidebar.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        sidebar.requestSubmit();
        editSchedule(data);
        return false;
      },
      { once: true }
    );
  }
}
/**
 *
 * @param {Partial<import('../data.js').Schedule>} data
 */
function editSchedule(data) {
  const instructor = facultyInput.value;
  const room = roomInput.value;
  const subject = subjectInput.value;
  const section = sectionInput.value;
  const day = dayInput.value;
  const start = startInput.value;
  const end = endInput.value;

  if (start >= end) {
    document.body.append(
      newElement('dialog', {
        closeable: true,
        text: 'Invalid time range',
        append: [
          newElement('w-button', {
            text: 'Close',
            type: 'close',
            variant: 'outlined',
          }),
        ],
      })
    );
    return;
  }

  const newData = {
    id:
      Math.max(
        ...Object.entries(schedules).flatMap(([, schedules]) =>
          schedules.map((s) => s.id)
        )
      ) + 1,
    ...data,
    instructor: Number(instructor),
    room,
    subject,
    section: Number(section),
    start: Number(start),
    end: Number(end),
    day: /** @type {typeof WEEKDAYS[keyof typeof WEEKDAYS]} */ (Number(day)),
  };

  const conflicts = checkScheduleConflicts(newData);

  if (checkScheduleConflicts(newData).length) {
    document.body.append(
      newElement('dialog', {
        text: 'Schedule conflict detected',
        append: [
          newElement('w-button', {
            text: 'Close',
            type: 'close',
            variant: 'outlined',
          }),
        ],
      })
    );
    return false;
  }

  schedules[newData.room] = schedules[newData.room] || [];

  if (findSchedule(newData.id)) {
    schedules[newData.room] = schedules[newData.room].filter(
      (s) => String(s.id) !== String(newData.id)
    );
  }

  schedules[newData.room].push(newData);

  updateTable();
  q$('.sidebar')?.classList.remove('open');
}

function findSchedule(id) {
  return Object.values(schedules).flatMap((schedules) =>
    schedules.find((schedule) => schedule.id === id)
  )[0];
}

// @ts-ignore
window.closeSidebar = (event) => {
  if (event.currentTarget !== event.target) return;

  q$('.sidebar')?.classList.remove('open');
};
