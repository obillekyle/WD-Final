import { accounts, session } from './data.js';

export function isLoggedIn() {
  return !!accounts[session.loggedAs || ''];
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
export function login(username, password) {
  if (isLoggedIn()) {
    return false;
  }

  let user = username;
  const pass = btoa(password);
  let account = accounts[username];

  if (!account) {
    Object.entries(accounts).find(([key, value]) => {
      if (value.email === username) {
        user = key;
        account = value;
        return true;
      }
    });
  }

  if (!account || account.password !== pass) {
    return false;
  }

  session.loggedAs = username;
  session.loggedAt = Date.now();

  return true;
}

export function getUser() {
  const user = accounts[session.loggedAs || ''];

  if (!user || !session.loggedAs) return undefined;

  return Object.assign({}, user, { id: session.loggedAs });
}

export function logout() {
  session.loggedAs = undefined;
  session.loggedAt = undefined;

  return true;
}
