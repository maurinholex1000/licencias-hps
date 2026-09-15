import { useState, useCallback } from 'react';
import { consultarSaldos, formatearFechaActualizacion } from '../services/api';

export const useSaldosRRHH = () => {
  const [saldos, setSaldos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const consultar = useCallback(async (dni) => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultarSaldos(dni);
      const normalizado = {
        nombre: data.nombre,
        cargo: data.cargo,
        laoTotal: data.lao_total,
        laoDetalle: data.lao_detalle || 'Sin detalles',
        compensatorios: data.total_compensatorios,
        actualizacion: formatearFechaActualizacion(data.actualizacion),
      };
      setSaldos(normalizado);
      return normalizado;
    } catch (err) {
      setError(err.message);
      setSaldos(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiar = () => {
    setSaldos(null);
    setError(null);
  };

  return { saldos, loading, error, consultar, limpiar };
};