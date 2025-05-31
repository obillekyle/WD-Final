import { debounce, newElement, q$ } from '../../utils.js';
import '../account-setup.js';
import { WDropdown } from '../../../components/select.js';
import { faculties, getFacultyName, programs } from '../../data.js';
import { getFacultyCard } from '../../mgmt/faculty.js';

const department = /** @type {WDropdown} */ (q$('#department'));
const params = new URLSearchParams(window.location.search);

const id = params.get('id') || '';
const faculty = faculties[id];

const preview = q$('.preview');
const form = /** @type {HTMLFormElement} */ (q$('form'));
const saveBtn = q$('#save');

if (!faculty) {
  document.body.append(
    newElement('w-dialog', {
      icon: 'material-symbols:warning',
      title: 'Faculty not found',
      text: 'The faculty you are trying to edit does not exist.',
      append: [
        newElement('w-button', {
          text: 'Close',
          type: 'close',
          variant: 'outlined',
          onclick: () => (location.href = '../faculty.html'),
        }),
      ],
    })
  );
}

if (form) {
  Object.entries(faculty).forEach(([key, value]) => {
    form[key].value = value;
  });
}

if (department) {
  department.options = Object.entries(programs).map(([id, data]) => ({
    value: id,
    label: data.name,
  }));
}

preview && preview.append(getFacultyCard(faculties));
form && form.addEventListener('input', () => debounce(updatePreview, 500));
saveBtn && saveBtn.addEventListener('click', editFaculty);

function updatePreview() {
  const formData = new FormData(form);

  preview?.replaceChildren(getFacultyCard(Object.fromEntries(formData)));
}

updatePreview();

function editFaculty() {
  if (form.checkValidity()) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    /** @type {import('../../data.js').Faculty} */
    const newFaculty = {
      title: String(data.title || ''),
      fname: String(data.fname),
      lname: String(data.lname),
      mname: String(data.mname || ''),
      suffix: String(data.suffix || ''),
      email: String(data.email),
      department: String(data.department || ''),
      status: Number(data.status),
      shift: Number(data.shift),
      contact: String(data.contact || ''),
    };

    faculties[id] = newFaculty;

    document.body.append(
      newElement('w-dialog', {
        icon: 'material-symbols:check',
        title: 'Faculty edited successfully',
        text: `
          The faculty ${getFacultyName(id)} has been edited successfully.
        `,
        append: [
          newElement('slot', {
            name: 'actions',
            append: [
              newElement('w-button', {
                text: 'Close',
                type: 'close',
                onclick: () => {
                  location.href = '../faculty.html';
                },
              }),
            ],
          }),
        ],
      })
    );
    return;
  }

  form.reportValidity();
}
