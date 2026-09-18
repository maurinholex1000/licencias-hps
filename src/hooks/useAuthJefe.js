import { useState, useCallback } from 'react';
import { loginJefe } from '../services/api';

const STORAGE_KEY = 'jefe_autenticado';

export const useAuthJefe = () => {
  // Recuperar sesión previa si existe
  const [jefe, setJefe] = useState(() => {
    try {
      const guardado = sessionStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const autenticar = useCallback(async (cuil, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginJefe(cuil, password);
      setJefe(data);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.message);
      setJefe(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cerrarSesion = () => {
    setJefe(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return { jefe, autenticado: !!jefe, loading, error, autenticar, cerrarSesion };
};