import { API_URL } from "../utils/constants";

const TOKEN_KEY = "examhub_token";
const USER_KEY = "examhub_user";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
};

export const request = async (path, { method = "GET", body } = {}) => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearSession();
    const error = new Error("Session expirée, veuillez vous reconnecter.");
    error.status = 401;
    throw error;
  }

  if (!res.ok) {
    const error = new Error(data.message || "Une erreur est survenue");
    error.status = res.status;
    throw error;
  }

  return data;
};