import { request, setToken } from './client';

const USER_KEY = 'examhub_user';

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const login = async (email, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setToken(data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
};