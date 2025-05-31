import { programs, subjects } from '../../data.js';
import { debounce, newElement, q$ } from '../../utils.js';
import { WDropdown } from '../../../components/select.js';
import { WInput } from '../../../components/input.js';
import { WTable } from '../../../components/table.js';
import '../account-setup.js';
import { WDialog } from '../../../components/dialog.js';

/** @type {(import('../../data.js').Subject & {id: string})[]} */

const inputs = [
  {
    id: '',
    program: '',
    title: '',
    units: 0,
  },
];

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

table.data = inputs;

function renderTable() {
  table.data = inputs;
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

  inputs.forEach((input, index) => {
    const { program, title, units, id } = input;

    const form = newElement('form', { id: `form-${index}` });
    const divider = newElement('w-input-divider', {
      append: [
        newElement('span', {
          text: `Subject ${index + 1}`,
        }),
        newElement('iconify-icon', {
          icon: 'material-symbols:remove',
          onclick: () => {
            inputs.splice(index, 1);
            renderInputs();
          },
        }),
      ],
    });

    const codeInput = newElement(
      'w-input',
      {
        label: 'Subject Code (unique)',
        name: 'code',
        icon: 'material-symbols:book-outline',
        pattern: '^[A-Z0-9\\-]{3,}$',
        required: true,
        placeholder: 'ABC-123',
        value: id,
        onchange: () => {
          input.id = codeInput.value;
        },
      },
      WInput
    );

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

    form.append(divider, codeInput, titleInput, programs, unitsInput);
    inputsContainer.append(form);
  });

  inputsContainer.append(
    newElement('w-button', {
      text: 'Add Subject',
      type: 'button',
      class: 'ml-auto',
      variant: 'outlined',
      onclick: () => {
        inputs.push({
          id: '',
          program: '',
          title: '',
          units: 0,
        });
        renderInputs();
      },
    })
  );

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

    if (form.code.value.toLowerCase() in subjects) {
      valid = false;
      form.code.setCustomValidity('Subject code already exists');
      form.reportValidity();
      break;
    }
  }

  if (valid) {
    for (const input of inputs) {
      subjects[input.id.toLowerCase()] = {
        title: input.title,
        program: input.program,
        units: input.units,
      };
    }

    document.body.append(
      newElement('w-dialog', {
        icon: 'material-symbols:info-outline',
        title: 'Success',
        text: 'Subjects added successfully.',
        append: [
          newElement('w-button', {
            text: 'Close',
            type: 'close',
            variant: 'outlined',
            onclick: () => (location.href = '../subject.html'),
          }),
        ],
      })
    );
  }
}
