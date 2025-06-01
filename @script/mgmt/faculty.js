import {
  faculties,
  getFacultyName,
  getLetterAvatar,
  getUserImage,
} from '../data.js';
import { SHIFTS, STATUS } from '../enums.js';
import { filteredJoin, newElement, switchCase } from '../utils.js';

/**
 *
 * @param {Partial<import('../data.js').Faculty>} idOrData
 * @param {boolean} full
 * @returns
 */
export function getFacultyCard(idOrData, full = false) {
  const data = typeof idOrData === 'string' ? faculties[idOrData] : idOrData;

  const card = newElement('div', {
    class: 'profile-card',
    append: [
      newElement('div', ['cover']),
      newElement('div', {
        avatar: '',
        style:
          'background-image: url(' + getLetterAvatar(data.fname?.[0]) + ');',
      }),
      newElement('span', {
        name: '',
        text:
          filteredJoin(
            [data.title, data.fname, data.mname, data.lname, data.suffix],
            ' '
          ) || 'N/A',
      }),

      newElement('span', {
        text: filteredJoin([data.department, 'Instructor'], ' - '),
      }),

      newElement('div', { class: 'divider' }),
      newElement('div', {
        class: 'flex-wrap gap-xs',
        append: [
          newElement('w-chip', {
            icon: 'material-symbols:work-history-outline',
            variant: 'outlined',
            text: switchCase(
              Number(data.shift || '-1'),
              [
                [SHIFTS.BOTH, 'AM/PM'],
                [SHIFTS.AM, 'AM'],
                [SHIFTS.PM, 'PM'],
              ],
              'N/A'
            ),
          }),

          newElement('w-chip', {
            icon: 'tabler:tie',
            variant: 'outlined',
            text: switchCase(
              Number(data.status || '-1'),
              [
                [STATUS.FULL_TIME, 'Full Time'],
                [STATUS.PART_TIME, 'Part Time'],
              ],
              'N/A'
            ),
          }),
        ],
      }),
    ],
  });

  return card;
}
