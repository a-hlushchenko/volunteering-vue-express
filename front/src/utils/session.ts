export const SESSION_KEY = "token";

//збереження сесії адміна
export const saveSession = (token: string) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(token));
  } catch (e) {}
};

//отримання сесії адміна
export const getSession = () => {
  try {
    const token = localStorage.getItem(SESSION_KEY);
    if (token) {
      const session = JSON.parse(token);
      return session || null;
    }
  } catch (e) {
    return null;
  }
};
