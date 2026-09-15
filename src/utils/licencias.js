import { TIPOS_NOVEDAD_ESPECIAL } from './constantes';
import { parsearDDMMYYYY, parsearISO } from './fechas';

export const calcularComputoTotal = (grupoActivo, formData) => {
  let corridos = 0;
  let habiles = 0;

  if (grupoActivo === 'lao') {
    corridos = Number(formData.a_dias) || 0;
  }

  if (grupoActivo === 'especial') {
    const novedad = TIPOS_NOVEDAD_ESPECIAL[formData.b_novedad];
    if (novedad) {
      let dias = Number(formData.b_dias) || 0;
      if (novedad.viaje && formData.b_chk_viaje) dias += 2;
      const computo = formData.b_computo_manual || novedad.computo;
      if (computo === 'CORRIDOS') corridos = dias;
      else habiles = dias;
    }
  }

  if (grupoActivo === 'compensatorios') {
    habiles = ['c', 'd', 'e', 'f'].reduce(
      (acc, k) => acc + (Number(formData[`${k}_dias`]) || 0),
      0
    );
  }

  return { corridos, habiles, total: corridos + habiles };
};

export const detectarSolapamiento = (fechaInicioCorridos, totalCorridos, fechasHabiles) => {
  if (!totalCorridos || !fechaInicioCorridos || !fechasHabiles?.length) {
    return { haySolapamiento: false, duplicadas: [] };
  }
  const inicio = fechaInicioCorridos.includes('-')
    ? parsearISO(fechaInicioCorridos)
    : parsearDDMMYYYY(fechaInicioCorridos);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + totalCorridos - 1);

  const duplicadas = fechasHabiles.filter((f) => {
    const fecha = parsearISO(f);
    return fecha >= inicio && fecha <= fin;
  });

  return { haySolapamiento: duplicadas.length > 0, duplicadas };
};