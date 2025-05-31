import { WTable } from '../../components/table.js';
import { faculties, getFacultyName } from '../data.js';
import { SHIFTS, STATUS } from '../enums.js';
import { isLoggedIn } from '../login.js';
import { debounce, expose, newElement, q$, switchCase } from '../utils.js';

import './account-setup.js';

if (!isLoggedIn) {
  window.location.href = `./index.html?redirect=${btoa(window.location.href)}`;
}

const table = /** @type {WTable} */ (q$('w-table'));

table.page = 1;
table.columns = {
  name: 'Name',
  department: 'Department',
  shift: 'Preferred Shift',
  status: 'Employment',
};

function getTableData() {
  return Object.entries(faculties).map(([id, data]) => ({
    id,
    name: getFacultyName(id),
    email: data.email,
    department: data.department,
    shift: switchCase(data.shift, [
      [SHIFTS.BOTH, 'AM/PM'],
      [SHIFTS.AM, 'AM'],
      [SHIFTS.PM, 'PM'],
    ]),
    status: switchCase(data.status, [
      [STATUS.FULL_TIME, 'Full Time'],
      [STATUS.PART_TIME, 'Part Time'],
    ]),
  }));
}

table.data = getTableData();

table.sort('name', 'asc');

function search(value) {
  table.search(value, 'name');
}

function onSearch(event) {
  debounce(search.bind(null, event.target.value), 300);
}

const deleteIcon = q$('#delete');
const editIcon = q$('#edit');
const refreshIcon = q$('#refresh');

refreshIcon?.addEventListener('click', () => table.refresh());
deleteIcon?.addEventListener('click', () => {
  document.body.appendChild(
    newElement('w-dialog', {
      icon: 'material-symbols:delete-outline',
      title: 'Delete Faculty',
      text: 'Are you sure you want to delete the selected faculties?',
      append: [
        newElement('slot', {
          name: 'actions',
          append: [
            newElement('w-button', {
              text: 'Cancel',
              type: 'close',
              variant: 'outlined',
            }),
            newElement('w-button', {
              text: 'Delete',
              class: 'error',
              onclick: (event) => {
                for (const id of table.selected) {
                  delete faculties[id];
                }
                table.data = getTableData();
                table.refresh();
                event.target.closest('w-dialog').close();
              },
            }),
          ],
        }),
      ],
    })
  );
});

editIcon?.addEventListener('click', () => {
  const id = table.selected[0];
  location.href = './faculty/edit.html?id=' + id;
});

table.onchange = () => {
  deleteIcon?.toggleAttribute('disabled', !table.selected.length);
  editIcon?.toggleAttribute('disabled', table.selected.length !== 1);
};

expose('search', onSearch);
