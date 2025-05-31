import { WTable } from '../../components/table.js';
import {
  faculties,
  getFacultyName,
  getRoomName,
  getSectionName,
  rooms,
  sections,
  subjects,
} from '../data.js';
import { isLoggedIn } from '../login.js';
import { debounce, expose, newElement, q$ } from '../utils.js';

import './account-setup.js';

if (!isLoggedIn) {
  window.location.href = `./index.html?redirect=${btoa(window.location.href)}`;
}

const table = /** @type {WTable} */ (q$('w-table'));

table.page = 1;
table.columns = {
  name: 'Subject Name',
  id: 'Subject Code',
  program: 'Program',
  units: 'Credit Units',
};

function getTableData() {
  return Object.entries(subjects).map(([id, data]) => ({
    id: id.toUpperCase(),
    name: data.title,
    program: data.program,
    units: data.units,
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
      title: 'Delete Subjects',
      html: 'Are you sure you want to delete the selected subjects?<br>This action cannot be undone.',
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
                  delete subjects[id];
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
  const ids = table.selected;
  location.href = './subject/edit.html?ids=' + JSON.stringify(ids);
});

table.onchange = () => {
  deleteIcon?.toggleAttribute('disabled', !table.selected.length);
  editIcon?.toggleAttribute('disabled', !table.selected.length);
};

expose('search', onSearch);
