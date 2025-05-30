import { createIcon } from '../../components/!util.js';
import { accounts, getUserFullname, getUserImage, profiles } from '../data.js';
import { NAME, ROLES } from '../enums.js';
import { getUser, logout } from '../login.js';
import {
  expose,
  newElement,
  openFilePicker,
  prepareImage,
  q$,
} from '../utils.js';
import './account-setup.js';
import { update } from './account-setup.js';
const profile = q$('#profile');
const account = q$('#account-info');

function updateProfile() {
  if (profile && account) {
    const user = getUser();

    if (user) {
      profile.style.backgroundImage = `url(${getUserImage(user.id)})`;
      profile.addEventListener('click', () => handleUpload(user));

      account.innerHTML = '';

      account.append(
        newElement('div', {
          name: '',
          text: getUserFullname(user.id, NAME.FULLNAME),
          append: [
            createIcon('material-symbols:drive-file-rename-outline-outline', {
              edit: '',
              onclick: () => openDetailEditor(),
            }),
          ],
        }),
        newElement('div', { mail: '', text: user.email }),
        newElement('w-chip', {
          variant: 'outlined',
          icon: getRoleIcon(user.role),
          text: user.role[0].toUpperCase() + user.role.slice(1),
        })
      );
    }
  }
}

function getRoleIcon(role) {
  switch (role) {
    case ROLES.MIS:
      return 'mdi:user-key-outline';
    case ROLES.VPAA:
      return 'ri:suitcase-line';
    case ROLES.ADMIN:
      return 'material-symbols:person-outline';
    default:
      return 'material-symbols:person';
  }
}

expose('logout', () => {
  logout();
  window.location.href = './index.html';
});

async function handleUpload(user) {
  const file = await openFilePicker('image/*');

  if (!file) {
    document.body.append(
      newElement('w-dialog', {
        icon: 'material-symbols:info-outline',
        title: 'Error',
        text: 'No file selected.',
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

  const imgString = await prepareImage(file);

  if (!imgString) {
    document.body.append(
      newElement('w-dialog', {
        icon: 'material-symbols:info-outline',
        title: 'Error',
        text: 'Failed to prepare image.',
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

  profile?.style.setProperty('background-image', `url(${imgString})`);
  profiles[user.id] = imgString;
  update();
}

updateProfile();

function submit(event) {
  event.preventDefault();
  const user = getUser();

  if (!user) {
    document.body.append(
      newElement('w-dialog', {
        icon: 'material-symbols:info-outline',
        title: 'Internal Error',
        text: 'User is not logged in.',
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

  console.log(accounts[user.id]);

  const form = /** @type {HTMLFormElement} */ (event.target);

  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());

  accounts[user.id] = Object.assign(accounts[user.id], values);

  updateProfile();

  document.body.append(
    newElement('w-dialog', {
      icon: 'material-symbols:info-outline',
      title: 'Success',
      text: 'Profile updated successfully.',
      append: [
        newElement('slot', {
          name: 'actions',
          append: [
            newElement('w-button', {
              text: 'Close',
              type: 'close',
              variant: 'outlined',
              onclick: () =>
                /** @type {any} */ (form.closest('w-dialog')).close(),
            }),
          ],
        }),
      ],
    })
  );
}

function openDetailEditor() {
  const user = getUser();

  document.body.append(
    newElement('w-dialog', {
      title: 'Update Profile',
      append: [
        newElement('form', {
          class: 'flex-col gap-md',
          onsubmit: submit,
          append: [
            newElement('w-input', {
              label: 'Title',
              name: 'title',
              type: 'text',
              value: user?.title,
            }),
            newElement('w-input', {
              label: 'First Name',
              name: 'fname',
              type: 'text',
              value: user?.fname,
              required: true,
            }),
            newElement('w-input', {
              label: 'Last Name',
              name: 'lname',
              type: 'text',
              value: user?.lname,
              required: true,
            }),
            newElement('w-input', {
              label: 'Middle Name',
              name: 'mname',
              type: 'text',
              value: user?.mname,
            }),
            newElement('w-input', {
              label: 'Email',
              name: 'email',
              type: 'email',
              value: user?.email,
            }),

            newElement('w-button', {
              text: 'Update',
              type: 'submit',
              variant: 'contained',
            }),
          ],
        }),
      ],
    })
  );
}
