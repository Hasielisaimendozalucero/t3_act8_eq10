import { useCallback, useEffect, useState } from 'react';

const URL_CHANGE_EVENT = 'urlparamschange';

const readParams = () => Object.fromEntries(new URLSearchParams(window.location.search));

// Lee y escribe parámetros de la URL (?view=alumnos&page=2&limit=20) sin librerías externas.
// pushState permite usar el botón "atrás" del navegador; replaceState se usa al escribir en el buscador.
export function useUrlParams() {
  const [params, setParams] = useState(readParams);

  useEffect(() => {
    const syncFromUrl = () => setParams(readParams());
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener(URL_CHANGE_EVENT, syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener(URL_CHANGE_EVENT, syncFromUrl);
    };
  }, []);

  const updateParams = useCallback((changes, { replace = false, reset = false } = {}) => {
    const nextParams = new URLSearchParams(reset ? '' : window.location.search);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') nextParams.delete(key);
      else nextParams.set(key, String(value));
    });
    const queryString = nextParams.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    window.history[replace ? 'replaceState' : 'pushState'](null, '', nextUrl);
    window.dispatchEvent(new Event(URL_CHANGE_EVENT));
  }, []);

  return [params, updateParams];
}
