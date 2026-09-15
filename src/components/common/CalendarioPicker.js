import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { MESES, DIAS_SEMANA } from '../../utils/constantes';
import { formatearDDMMYYYY } from '../../utils/fechas';

const CalendarioPicker = ({
  modo = 'multiple',
  valorInicial,
  maxSeleccionables = Infinity,
  onSelect,
  onClose,
  tituloInfo,
}) => {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());

  const valorNormalizado =
    modo === 'multiple'
      ? Array.isArray(valorInicial) ? valorInicial : []
      : valorInicial || '';

  const [seleccion, setSeleccion] = useState(valorNormalizado);

  const cambiarMes = (dir) => {
    let m = mes + dir;
    let a = anio;
    if (m < 0) { m = 11; a--; }
    else if (m > 11) { m = 0; a++; }
    setMes(m);
    setAnio(a);
  };

  const toggleFecha = (iso) => {
    if (modo === 'unico') {
      setSeleccion(iso);
      return;
    }
    const ya = seleccion.includes(iso);
    if (ya) setSeleccion(seleccion.filter((f) => f !== iso));
    else if (seleccion.length < maxSeleccionables) setSeleccion([...seleccion, iso].sort());
  };

  const limpiar = () => setSeleccion(modo === 'multiple' ? [] : '');

  const confirmar = () => {
    if (modo === 'unico') {
      onSelect(seleccion ? formatearDDMMYYYY(seleccion) : '');
    } else {
      onSelect(seleccion);
    }
    onClose?.();
  };

  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const celdas = [];
  for (let i = 0; i < primerDia; i++) celdas.push(null);
  for (let d = 1; d <= totalDias; d++) celdas.push(d);

  const statusTexto =
    modo === 'multiple'
      ? `Seleccionados: ${seleccion.length} / ${maxSeleccionables === Infinity ? '∞' : maxSeleccionables}`
      : tituloInfo || 'Seleccione una fecha';

  return (
    <div className="popover-cal">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Button variant="light" size="sm" onClick={() => cambiarMes(-1)}>◀</Button>
        <strong className="text-primary">{MESES[mes]} {anio}</strong>
        <Button variant="light" size="sm" onClick={() => cambiarMes(1)}>▶</Button>
      </div>
      <div className="small text-center bg-light py-1 rounded mb-2 fw-semibold text-primary">
        {statusTexto}
      </div>
      <div className="cal-grid-dias">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="cal-dia-head">{d}</div>
        ))}
        {celdas.map((d, i) => {
          if (d === null) return <div key={`v-${i}`} className="cal-dia-btn vacio"></div>;
          const iso = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isSelected = modo === 'unico' ? seleccion === iso : seleccion.includes(iso);
          return (
            <button
              key={iso}
              type="button"
              className={`cal-dia-btn ${isSelected ? 'seleccionado' : ''}`}
              onClick={() => toggleFecha(iso)}
            >
              {d}
            </button>
          );
        })}
      </div>
      <ButtonGroup size="sm" className="w-100 mt-2">
        <Button variant="outline-danger" onClick={limpiar}>
          {modo === 'multiple' ? 'Limpiar' : 'Cerrar'}
        </Button>
        <Button variant="success" onClick={confirmar}>Aceptar</Button>
      </ButtonGroup>
    </div>
  );
};

export default CalendarioPicker;