import { useEffect, useState } from 'react';

export const useDebounce = (valor, delay = 500) => {
  const [debounced, setDebounced] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(t);
  }, [valor, delay]);
  return debounced;
};