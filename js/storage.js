const KEYS = {
  users: "interapp_users_v1",
  session: "interapp_session_v1",
  products: "interapp_products_v1",
  exchanges: "interapp_exchanges_v1",
};
function read(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export const getUsers = () => read(KEYS.users);
export const saveUsers = (value) => write(KEYS.users, value);
export const getSession = () => read(KEYS.session, null);
export const setSession = (value) => write(KEYS.session, value);
export const clearSession = () => localStorage.removeItem(KEYS.session);
export const getProducts = () => read(KEYS.products);
export const saveProducts = (value) => write(KEYS.products, value);
export const getExchanges = () => read(KEYS.exchanges);
export const saveExchanges = (value) => write(KEYS.exchanges, value);
export function currentUser() {
  const session = getSession();
  return session
    ? (getUsers().find((u) => u.id === session.userId) ?? null)
    : null;
}
export function requireAuth() {
  const user = currentUser();
  if (!user) {
    location.href = "login.html";
    return null;
  }
  return user;
}
export function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
