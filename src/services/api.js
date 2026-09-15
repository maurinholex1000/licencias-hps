const URL_API = process.env.REACT_APP_API_RRHH_URL;

export const consultarSaldos = async (dni) => {
    console.log('URL_API:', URL_API);
  if (!dni || !dni.trim()) throw new Error('DNI requerido');
  const res = await fetch(`${URL_API}?dni=${encodeURIComponent(dni.trim())}`);
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  const data = await res.json();
  if (!data.encontrado) throw new Error('El DNI no figura en el sistema');
  return data;
};

export const formatearFechaActualizacion = (fecha) => {
  if (!fecha) return '—';
  if (typeof fecha === 'string' && fecha.includes('GMT')) {
    const d = new Date(fecha);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  return fecha;
};