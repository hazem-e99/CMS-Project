import api from './api';

/**
 * Attempt to log in a user using the mock JSON Server backend.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token:string,user:Object}>}
 */
export async function login(email, password) {
  const { data: users } = await api.get('/users', {
    params: { email, password },
  });

  if (!users.length) {
    throw new Error('Invalid credentials');
  }

  const user = users[0];
  const token = `mock-token-${user.id}-${Date.now()}`;
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * Mock logout helper (cleans up any future side effects).
 * @returns {Promise<void>}
 */
export async function logout() {
  return Promise.resolve();
}

export const authService = {
  login,
  logout,
};

