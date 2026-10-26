// Cliente HTTP centralizado: convierte cualquier falla en un Error con un mensaje legible.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request(url, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión a internet.', 0);
  }

  // Algunas respuestas de error pueden no traer JSON
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message || `El servidor respondió con un error (${response.status}).`, response.status);
  }

  return data;
}
