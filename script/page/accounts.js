import { WTable } from '../../components/table.js';
import { accounts, faculties, getUserFullname } from '../data.js';
import { NAME, ROLES } from '../enums.js';
import { isLoggedIn } from '../login.js';
import { debounce, expose, newElement, q$ } from '../utils.js';

import './account-setup.js';

if (!isLoggedIn) {
  window.location.href = `./index.html?redirect=${btoa(window.location.href)}`;
}

const table = /** @type {WTable} */ (q$('w-table'));

table.page = 1;
table.columns = {
  name: 'Name',
  email: 'Email',
  role: 'Role',
};

function getTableData() {
  return Object.entries(accounts).map(([id, data]) => ({
    id,
    name: getUserFullname(id, NAME.WITH_INITIAL),
    email: data.email,
    role: getRoleName(data.role),
  }));
}

function getRoleName(role) {
  switch (role) {
    case ROLES.MIS:
      return 'MIS';
    case ROLES.VPAA:
      return 'VPAA';
    case ROLES.ADMIN:
      return 'Admin Staff';
  }
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

table.onchange = () => {
  deleteIcon?.toggleAttribute('disabled', !table.selected.length);
  editIcon?.toggleAttribute('disabled', !table.selected.length);
};

expose('search', onSearch);
