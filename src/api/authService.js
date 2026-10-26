import { ApiError, request } from './httpClient';

const AUTH_URL = 'https://dummyjson.com/auth/login';
const USERS_SEARCH_URL = 'https://dummyjson.com/users/search';

// Si el usuario escribió un correo, buscamos su username (DummyJSON solo autentica por username).
async function resolveUsername(userInput) {
  const cleanInput = userInput.trim();
  if (!cleanInput.includes('@')) return cleanInput;

  try {
    const data = await request(`${USERS_SEARCH_URL}?q=${encodeURIComponent(cleanInput)}&select=username,email`);
    const foundUser = data.users?.find((u) => u.email.toLowerCase() === cleanInput.toLowerCase());
    return foundUser ? foundUser.username : cleanInput;
  } catch {
    return cleanInput;
  }
}

export async function loginUser(userInput, password) {
  const username = await resolveUsername(userInput);

  try {
    return await request(AUTH_URL, {
      method: 'POST',
      body: { username, password, expiresInMins: 60 },
    });
  } catch (error) {
    // DummyJSON responde 400 "Invalid credentials" cuando los datos no coinciden.
    if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
      throw new ApiError('Usuario o contraseña incorrectos.', error.status);
    }
    throw error;
  }
}
