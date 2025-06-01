import {
  getFacultyName,
  getOngoingSchedule,
  getRoomName,
  getSectionName,
} from '../data.js';
import { isLoggedIn } from '../login.js';
import { newElement, q$ } from '../utils.js';
import './account-setup.js';

if (!isLoggedIn()) {
  window.location.href = `./index.html?redirect=${btoa(window.location.href)}`;
}
const occupiedRooms = q$('#occupied');

for (const schedule of getOngoingSchedule()) {
  occupiedRooms?.append(
    newElement('div', {
      class: 'room ripple',
      append: [
        newElement('span', { text: getRoomName(schedule.room) }),
        newElement('span', { text: getSectionName(schedule.section) }),
        newElement('span', { text: getFacultyName(schedule.instructor) }),
      ],
      onclick: () => {
        window.location.href = `./schedule.html?type=room&id=${schedule.room}`;
      },
    })
  );
}
