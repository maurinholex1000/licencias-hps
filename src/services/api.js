const URL_API = process.env.REACT_APP_API_RRHH_URL;

export const consultarSaldos = async (dni) => {
  const dniLimpio = String(dni ?? '').trim();

  if (!dniLimpio) throw new Error('DNI requerido');

  const inicio = performance.now();

  try {
    const res = await fetch(
      `${URL_API}?dni=${encodeURIComponent(dniLimpio)}`
    );

    console.log(
      `Tiempo de respuesta HTTP: ${(performance.now() - inicio).toFixed(0)} ms`
    );

    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

    const data = await res.json();

    console.log(
      `Tiempo total: ${(performance.now() - inicio).toFixed(0)} ms`
    );

    if (!data.encontrado) {
      throw new Error('El DNI no figura en el sistema');
    }

    return data;
  } catch (error) {
    console.error('Error al consultar saldos:', error);
    throw error;
  }
};
export const formatearFechaActualizacion = (fecha) => {
  if (!fecha) return '—';
  if (typeof fecha === 'string' && fecha.includes('GMT')) {
    const d = new Date(fecha);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  return fecha;
};

export const loginJefe = async (cuil, password) => {
  const url = `${URL_API}?accion=login&cuil=${encodeURIComponent(cuil)}&password=${encodeURIComponent(password)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.autenticado) {
    throw new Error(data.messages?.[0] || 'CUIL o contraseña incorrectos');
  }
  return data.data;
};

export const hacerPedido = async ({ dni, nombre, fecha }) => {
  const dniLimpio = String(dni ?? '').trim();
  if (!dniLimpio) throw new Error('DNI requerido para realizar el pedido');

  const fechaHoy = fecha || new Date().toLocaleDateString('es-AR');

  const url = `${URL_API}?accion=hacerPedido&estado=${encodeURIComponent('PEDIDO PENDIENTE AL')}&fecha=${encodeURIComponent(fechaHoy)}&dni=${encodeURIComponent(dniLimpio)}&nombre=${encodeURIComponent(nombre || '')}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

  const data = await res.json();
  if (!data.exito) {
    throw new Error(data.error || 'No se pudo realizar el pedido');
  }

  return data;
};