import { MESES } from './constantes';

export const parsearISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const parsearDDMMYYYY = (str) => {
  const [d, m, y] = str.split('/').map(Number);
  return new Date(y, m - 1, d);
};

export const formatearDDMMYYYY = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export const formatearISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const agruparFechasPorMes = (fechasISO) => {
  const grupos = {};
  fechasISO.forEach((f) => {
    const [y, m, d] = f.split('-');
    const clave = `${m}/${y}`;
    if (!grupos[clave]) grupos[clave] = [];
    grupos[clave].push(d);
  });
  const bloques = Object.entries(grupos).map(([clave, dias]) => `${dias.join(', ')}/${clave}`);
  if (bloques.length <= 1) return bloques[0] || '';
  const ultimo = bloques.pop();
  return `${bloques.join(', ')} y ${ultimo}`;
};