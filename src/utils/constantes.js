export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const TIPOS_NOVEDAD_ESPECIAL = {
  PERMISO_NATALICIO: { art: '—', ley: '—', computo: 'HABILES', dias: 1, viaje: false, etiqueta: 'Permiso Especial por Natalicio (1 día hábil)' },
  ART63TER: { art: '63° TER', ley: '3161', computo: 'HABILES', dias: 1, viaje: false, etiqueta: 'ART. 63° (TER) - Estudios Ginecológicos' },
  ART69:    { art: '69°', ley: '3161', computo: 'HABILES', dias: 10, viaje: false, etiqueta: 'ART. 69° - Particulares sin Goce' },
  ART71:    { art: '71°', ley: '3161', computo: 'HABILES', dias: 12, viaje: false, etiqueta: 'ART. 71° - Matrimonio Agente' },
  ART72_NAC:{ art: '72°', ley: '3161', computo: 'CORRIDOS', dias: 30, viaje: false, etiqueta: 'ART. 72° - Nacimiento de Hijo' },
  ART72_HIJO:{ art: '72°', ley: '3161', computo: 'HABILES', dias: 2, viaje: true, etiqueta: 'ART. 72° - Matrimonio de Hijo' },
  ART73:    { art: '73°', ley: '3161', computo: 'CORRIDOS', dias: 3, viaje: true, etiqueta: 'ART. 73° - Fallecimiento Familiar' },
  ART76:    { art: '76°', ley: '3161', computo: 'HABILES', dias: 7, viaje: false, etiqueta: 'ART. 76° - Estudios - Rendir Finales' },
  ART80:    { art: '80°', ley: '3161', computo: 'HABILES', dias: 1, viaje: false, etiqueta: 'ART. 80° - Citación Judicial' },
  LEY4327:  { art: '5°', ley: 'LEY 4327', computo: 'CORRIDOS', dias: 15, viaje: false, etiqueta: 'LEY 4327 ART. 5° - Radiología' },
};

export const ESTADO_INICIAL_AGENTE = {
  dirigido: 'DIRECTOR DEL HOSPITAL PABLO SORIA',
  fechaEmision: 'HOY',
  dni: '',
  nombre: '',
  categoria: '',
  fechaInicio: '',
  grupoActivo: 'lao',
  a_norma: 'ART57',
  a_dias: 0,
  a_anio: 'Sin determinar',
  b_novedad: '',
  b_dias: 0,
  b_motivo: '',
  b_articulo: '',
  b_ley: '',
  b_chk_viaje: false,
  b_computo_manual: 'HABILES',
  b_adjunto: null,
  c_dias: 0, c_horas: 0,
  d_dias: 0, d_horas: 0,
  e_dias: 0, e_horas: 0,
  f_dias: 0, f_horas: 0,
  totalCorridos: 0,
  totalHabiles: 0,
  totalGeneral: 0,
  corridosDetalle: '',
  habilesDetalle: '',
  fechasSeleccionadas: [],
  firmaAgenteDataURL: '',
};

export const ESTADO_INICIAL_JEFE = {
  autoriza: 'SI',
  reemplazo: 'NO',
  parcialCorridos: 0,
  parcialHabiles: 0,
  parcialCorridosDetalle: '',
  fechasJefeAutorizadas: [],
  rep1: { nombre: '', dni: '', dias: '' },
  rep2: { nombre: '', dni: '', dias: '' },
  rep3: { nombre: '', dni: '', dias: '' },
  jefeNombre: '',
  jefeACargo: false,
  jefeServicio: '',
  jefeHospital: 'Hospital Pablo Soria',
  jefeFecha: new Date().toISOString().substring(0, 10),
  firmaJefeDataURL: '',
};