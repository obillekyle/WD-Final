import { WTable } from '../../components/table.js';
import {
  faculties,
  getFacultyName,
  getSectionName,
  sections,
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
  name: 'Section',
  program: 'Program',
  year: 'Year',
  section: 'Section',
};

function getTableData() {
  return Object.entries(sections).map(([id, data]) => ({
    id,
    name: getSectionName(id),
    program: data.program,
    year: data.year,
    section: data.section,
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
      title: 'Delete Sections',
      html: 'Are you sure you want to delete the selected sections?<br>This action cannot be undone.',
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
                  delete sections[id];
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
  location.href = './section/edit.html?ids=' + JSON.stringify(ids);
});

table.onchange = () => {
  deleteIcon?.toggleAttribute('disabled', !table.selected.length);
  editIcon?.toggleAttribute('disabled', !table.selected.length);
};

expose('search', onSearch);
