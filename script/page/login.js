import WInput from '../../components/input.js';
import { isLoggedIn, login } from '../login.js';
import { expose, q$ } from '../utils.js';

const params = new URLSearchParams(window.location.search);
const redirect = atob(params.get('redirect') || btoa('./dashboard.html'));

if (isLoggedIn()) window.location.href = redirect;

function onSubmit(event) {
  event.preventDefault();

  const userInput = /** @type {WInput} */ (q$('#username'));
  const passInput = /** @type {WInput} */ (q$('#password'));

  const username = userInput?.value;
  const password = passInput?.value;

  if (login(username, password)) {
    window.location.href = redirect;
    return true;
  }

  userInput.input.setCustomValidity('Invalid username or password.');
  passInput.input.setCustomValidity('Invalid username or password.');
}

expose('onSubmit', onSubmit);
