import { programs, subjects } from '../../data.js';
import { debounce, newElement, q$ } from '../../utils.js';
import { WDropdown } from '../../../components/select.js';
import { WInput } from '../../../components/input.js';
import { WTable } from '../../../components/table.js';
import { openDialog } from '../../../components/dialog.js';
import '../account-setup.js';

const params = new URLSearchParams(window.location.search);
let ids = JSON.parse(params.get('ids') || '');

/** @type {Record<string, import('../../data.js').Subject>} */
const inputs = Object.fromEntries(
  ids
    .map((id) => [id.toLowerCase(), { ...subjects[id.toLowerCase()] }])
    .filter(([id]) => id in subjects)
);

if (!ids.length || !Object.keys(inputs).length) {
  openDialog({
    icon: 'material-symbols:warning',
    title: 'No provided subjects',
    content: 'No subjects were provided to edit.',
    actions: [
      newElement('w-button', {
        text: 'Close',
        type: 'close',
        href: '../subjects.html',
      }),
    ],
  });
}

console.log(inputs);

const saveBtn = q$('#save');
const inputsContainer = q$('#inputs');
const table = /** @type {WTable} */ (q$('w-table'));
const dropdownItems = Object.entries(programs).map(([id, data]) => ({
  value: id,
  label: data.name,
}));

saveBtn?.addEventListener('click', saveChanges);

// render table

table.page = 1;
table.columns = {
  title: 'Subject Name',
  id: 'Subject Code',
  program: 'Program',
  units: 'Credit Units',
};

table.data = Object.entries(inputs).map(([id, data]) => ({
  id: id.toUpperCase(),
  title: data.title,
  program: data.program,
  units: data.units,
}));

function renderTable() {
  table.data = Object.entries(inputs).map(([id, data]) => ({
    id: id.toUpperCase(),
    title: data.title,
    program: data.program,
    units: data.units,
  }));
  table.refresh();
}

inputsContainer?.addEventListener('input', () => {
  debounce(renderTable, 500);
});

renderTable();

function renderInputs() {
  if (!inputsContainer) {
    return;
  }

  inputsContainer.innerHTML = '';

  Object.entries(inputs).forEach(([index, input]) => {
    const { program, title, units } = input;

    const form = newElement('form', { id: `form-${index}` });
    const divider = newElement('w-input-divider', {
      text: `Subject ${index.toUpperCase()}`,
    });

    const programs = newElement(
      'w-dropdown',
      {
        name: 'program',
        label: 'Program',
        icon: 'mingcute:department-line',
        required: true,
        placeholder: 'Select Program',
        value: program,
      },
      WDropdown
    );

    programs.options = dropdownItems;
    programs.onchange = () => {
      input.program = programs.value;
    };

    const unitsInput = newElement(
      'w-input',
      {
        label: 'Units',
        type: 'number',
        icon: 'material-symbols:star-outline',
        name: 'units',
        required: true,
        min: 1,
        max: 3,
        value: units,
        onchange: () => {
          input.units = Number(unitsInput.value || 0);
        },
      },
      WInput
    );

    const titleInput = newElement(
      'w-input',
      {
        label: 'Program Title',
        icon: 'mdi:card-text-outline',
        name: 'title',
        required: true,
        value: title,
        onchange: () => {
          input.title = titleInput.value;
        },
      },
      WInput
    );

    form.append(divider, titleInput, programs, unitsInput);
    inputsContainer.append(form);
  });
  renderTable();
}

renderInputs();

function saveChanges() {
  const forms = document.querySelectorAll('form');

  let valid = true;

  for (const form of forms) {
    if (!form.reportValidity()) {
      valid = false;
      break;
    }
  }

  if (valid) {
    for (const [index, input] of Object.entries(inputs)) {
      subjects[index.toLowerCase()] = {
        title: input.title,
        program: input.program,
        units: input.units,
      };
    }

    openDialog({
      icon: 'material-symbols:info-outline',
      title: 'Success',
      content: 'Subjects edited successfully.',
      actions: [
        newElement('w-button', {
          text: 'Close',
          type: 'close',
          variant: 'outlined',
          onclick: () => (location.href = '../subject.html'),
        }),
      ],
    });
  }
}
