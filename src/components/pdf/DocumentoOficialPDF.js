import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MESES } from '../../utils/constantes';

const DocumentoOficialPDF = ({
  agente,
  jefe,
  firmaAgenteDataURL,
  firmaJefeDataURL,
}) => {
  const containerRef = useRef(null);

  if (!containerRef.current) {
    containerRef.current = document.createElement('div');
    containerRef.current.id = 'contenedor-render';
    containerRef.current.setAttribute('aria-hidden', 'true');
  }

  useEffect(() => {
    const container = containerRef.current;
    document.body.appendChild(container);
    return () => {
      if (container.parentNode) container.parentNode.removeChild(container);
    };
  }, []);

  if (!agente) return null;

  const esJefe = !!jefe && !!firmaJefeDataURL;

  const hoy = new Date();
  const emisionOpt = agente.emisionOpt || agente.fechaEmision || 'HOY';
  const dirigido = agente.dirigido || 'DIRECTOR DEL HOSPITAL PABLO SORIA';

  const licDia = agente.licDia || (agente.fechaInicio ? agente.fechaInicio.split('-')[2] : '');
  const licMes = agente.licMes || (agente.fechaInicio ? MESES[Number(agente.fechaInicio.split('-')[1]) - 1] : '');
  const licAnio = agente.licAnio || (agente.fechaInicio ? agente.fechaInicio.split('-')[0].substring(2) : '');

  // IMPORTANTE: Se reemplazaron los caracteres '……' por espacios en blanco '\u00A0'
  let fechaJefeStr = (
    <>
      San Salvador de Jujuy,{' '}
      <span className="puntos-relleno" style={{ minWidth: 35 }}>{'\u00A0'}</span>{' '}
      de{' '}
      <span className="puntos-relleno" style={{ minWidth: 120 }}>{'\u00A0'}</span>{' '}
      de 20
      <span className="puntos-relleno" style={{ minWidth: 25 }}>{'\u00A0'}</span>
    </>
  );

  let dictamenHTML = 'Atento a lo solicitado, SI / NO autorizo a tomar <span class="puntos-relleno" style="min-width:30px; display:inline-block">&nbsp;</span> días <span class="puntos-relleno" style="min-width:40px; display:inline-block">&nbsp;</span> corridos y <span class="puntos-relleno" style="min-width:40px; display:inline-block">&nbsp;</span> hábiles a partir del día <span class="puntos-relleno" style="min-width:80px; display:inline-block">&nbsp;</span>. Considerando que SI / NO debe designarse remplazante. -';
  
  let reemplazosHTML = 'PROPONIENDO A: <span class="puntos-relleno" style="min-width:220px; display:inline-block">&nbsp;</span> DNI N° <span class="puntos-relleno" style="min-width:90px; display:inline-block">&nbsp;</span> Cant. Dias <span class="puntos-relleno" style="min-width:30px; display:inline-block">&nbsp;</span><br>PROPONIENDO A: <span class="puntos-relleno" style="min-width:220px; display:inline-block">&nbsp;</span> DNI N° <span class="puntos-relleno" style="min-width:90px; display:inline-block">&nbsp;</span> Cant. Dias <span class="puntos-relleno" style="min-width:30px; display:inline-block">&nbsp;</span><br>PROPONIENDO A: <span class="puntos-relleno" style="min-width:220px; display:inline-block">&nbsp;</span> DNI N° <span class="puntos-relleno" style="min-width:90px; display:inline-block">&nbsp;</span> Cant. Dias <span class="puntos-relleno" style="min-width:30px; display:inline-block">&nbsp;</span>';

  if (esJefe) {
    const {
      autoriza,
      parcialCorridos,
      parcialCorridosDetalle,
      fechasJefeAutorizadas,
      reemplazo,
      jefeFecha,
    } = jefe;

    if (jefeFecha) {
      const [jY, jM, jD] = jefeFecha.split('-');
      fechaJefeStr = `San Salvador de Jujuy, ${jD} de ${MESES[Number(jM) - 1]} de 20${jY.substring(2)}`;
    }

    let dic = 'SI';
    let tDict = agente.totalGeneral;
    let cTxt = `${agente.totalCorridos} corridos`;
    let hTxt = `${agente.totalHabiles} hábiles`;
    const mesNum = (MESES.indexOf(licMes) + 1).toString().padStart(2, '0');
    let fInicio = `${licDia}/${mesNum}/${licAnio}`;

    if (autoriza === 'PARCIAL') {
      dic = 'y por necesidad del servicio';
      const pC = Number(parcialCorridos) || 0;
      tDict = pC + (fechasJefeAutorizadas?.length || 0);
      cTxt = `${pC} corridos`;
      hTxt = `${fechasJefeAutorizadas?.length || 0} hábiles`;
      if (parcialCorridosDetalle) fInicio = parcialCorridosDetalle;
    } else if (autoriza === 'NO') {
      dic = 'NO';
    }

    dictamenHTML = `Atento a lo solicitado, <strong>${dic}</strong> autorizo a tomar ${tDict} días — ${cTxt} y ${hTxt} a partir del ${fInicio}. Considerando que ${reemplazo} debe designarse reemplazante. -`;

    const linea = (r) => {
      const n = (r?.nombre || '').trim().toUpperCase();
      const d = (r?.dni || '').trim();
      const c = (r?.dias || '').toString().trim();
      if (!n) return 'PROPONIENDO A: <span class="puntos-relleno" style="min-width:220px; display:inline-block">&nbsp;</span> DNI N° <span class="puntos-relleno" style="min-width:90px; display:inline-block">&nbsp;</span> Cant. Dias <span class="puntos-relleno" style="min-width:30px; display:inline-block">&nbsp;</span>';
      return `PROPONIENDO A: <strong>${n}</strong> DNI N° <strong>${d || '&nbsp;'}</strong> Cant. Dias <strong>${c || '&nbsp;'}</strong>`;
    };
    reemplazosHTML = `${linea(jefe.rep1)}<br>${linea(jefe.rep2)}<br>${linea(jefe.rep3)}`;
  }

  const saldos = agente.saldosRRHH;

  const contenido = (
    <div className="hoja-oficio" id="documento-oficial-unico">
      {/* SECCIÓN 1: SOLICITUD AGENTE */}
      <div className="bloque-seccion bloque-superior-solicitud">
        <div className="encabezado">
          Hospital Pablo Soria
          <br />
          S. S. de Jujuy
        </div>
        
        <div className="lugar-fecha">
          San Salvador de Jujuy,{' '}
          <span className="puntos-relleno" style={{ minWidth: 35 }}>
            {emisionOpt === 'HOY' ? hoy.getDate().toString().padStart(2, '0') : '\u00A0'}
          </span>{' '}
          de{' '}
          <span className="puntos-relleno" style={{ minWidth: 100 }}>
            {emisionOpt === 'HOY' ? MESES[hoy.getMonth()] : '\u00A0'}
          </span>{' '}
          de 20
          <span className="puntos-relleno" style={{ minWidth: 25 }}>
            {emisionOpt === 'HOY' ? hoy.getFullYear().toString().substring(2) : '\u00A0'}
          </span>
        </div>

        <div className="destinatario">
          AL SEÑOR: <span className="puntos-relleno" style={{ minWidth: 320 }}>{dirigido}</span>
          <br />
          <u>SU DESPACHO</u>
        </div>

        <div className="cuerpo-texto">
  Tengo el agrado de dirigirme a el/la señor/a <strong>DIRECTOR/A</strong> con el objeto de
  solicitarle me conceda licencia a partir del día{' '}
  <span className="puntos-relleno texto-centrado" style={{ minWidth: 35 }}>
    {licDia || '\u00A0'}
  </span>{' '}
  de{' '}
  <span className="puntos-relleno texto-centrado" style={{ minWidth: 90 }}>
    {licMes || '\u00A0'}
  </span>{' '}
  de 20
  <span className="puntos-relleno texto-centrado" style={{ minWidth: 25 }}>
    {licAnio || '\u00A0'}
  </span>{' '}
  de acuerdo al detalle siguiente:
</div>
        <div className="items-licencia">
          <div className="item-linea">
            a){' '}
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
              {agente.a_dias || '\u00A0'}
            </span>{' '}
            días de licencia anual ordinaria con Art 56° en caso de corresponder año 20
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 35 }}>
              {agente.a_anio && agente.a_anio.toLowerCase() !== 'sin determinar'
                ? agente.a_anio.slice(-2)
                : '\u00A0'}
            </span>
            .-
          </div>
          <div className="item-linea">
            b){' '}
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
              {agente.b_dias || '\u00A0'}
            </span>{' '}
            días de licencia por{' '}
            <span className="puntos-relleno" style={{ minWidth: 200 }}>
              {agente.b_motivo || '\u00A0'}
            </span>{' '}
            según artículo N°{' '}
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 30 }}>
              {agente.b_articulo || '\u00A0'}
            </span>{' '}
            de la ley N°{' '}
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 45 }}>
              {agente.b_ley || '\u00A0'}
            </span>
          </div>
          <div className="item-linea">
            c){' '}
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
              {agente.c_dias || '\u00A0'}
            </span>{' '}
            días de licencia por guardias realizadas. -{' '}
            {agente.c_horas > 0 && <em>({agente.c_horas} Hs)</em>}
          </div>
          <div className="item-linea">
            d){' '}
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
              {agente.d_dias || '\u00A0'}
            </span>{' '}
            días de licencia por recargo. -{' '}
            {agente.d_horas > 0 && <em>({agente.d_horas} Hs)</em>}
          </div>
          <div className="item-linea">
            e){' '}
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
              {agente.e_dias || '\u00A0'}
            </span>{' '}
            días de licencia por feriado. -{' '}
            {agente.e_horas > 0 && <em>({agente.e_horas} Hs)</em>}
          </div>
          <div className="item-linea">
            f){' '}
            <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
              {agente.f_dias || '\u00A0'}
            </span>{' '}
            días de licencia por horas nocturnas. -{' '}
            {agente.f_horas > 0 && <em>({agente.f_horas} Hs)</em>}
          </div>
        </div>

        <div className="totales-bloque">
          <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
            {agente.totalCorridos || '\u00A0'}
          </span>{' '}
          CORRIDOS (a partir de:{' '}
          <span className="puntos-relleno texto-centrado" style={{ minWidth: 130 }}>
            {agente.corridosDetalle || '\u00A0'}
          </span>{' '}
          )<br />
          <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
            {agente.totalHabiles || '\u00A0'}
          </span>{' '}
          HABILES (los días:{' '}
          <span className="puntos-relleno texto-centrado" style={{ minWidth: 240 }}>
            {agente.habilesDetalle || '\u00A0'}
          </span>{' '}
          )<br />
          <span className="puntos-relleno texto-centrado" style={{ minWidth: 40 }}>
            {agente.totalGeneral || '\u00A0'}
          </span>{' '}
          TOTAL DE DIAS DE LICENCIA
        </div>

        <table className="tabla-firmas-solicitante">
          <tbody>
            <tr>
              <td className="celda-dato-render">{agente.nombre}</td>
              <td className="celda-dato-render">{agente.categoria}</td>
              <td className="celda-dato-render">
                {firmaAgenteDataURL && (
                  <img className="imagen-firma-render" src={firmaAgenteDataURL} alt="Firma agente" />
                )}
              </td>
            </tr>
            <tr>
              <td className="celda-aclaracion-render">Apellido y Nombre</td>
              <td className="celda-aclaracion-render">Categoría y/o Función</td>
              <td className="celda-aclaracion-render">Firma del Agente</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="linea-separadora-puntos" />

      {/* SECCIÓN 2: AUTORIZACIÓN JEFE DE SERVICIO */}
      <div className="bloque-seccion seccion-autorizacion">
        <div className="autorizacion-contenido">
          <div className="lugar-fecha" style={{ marginBottom: 12, textAlign: 'right' }}>
            {fechaJefeStr}
          </div>
          <div
            className="cuerpo-texto"
            style={{ textIndent: 0, marginBottom: 10 }}
            dangerouslySetInnerHTML={{ __html: dictamenHTML }}
          />
          <div
            className="cuerpo-texto"
            style={{ textIndent: 0, lineHeight: 1.5, marginBottom: 10 }}
            dangerouslySetInnerHTML={{ __html: reemplazosHTML }}
          />
          <div className="cuerpo-texto" style={{ textIndent: 0 }}>
            Para cubrir el reemplazo previsto y a fin de no entorpecer el normal funcionamiento
            de los servicios, la presente autorización corresponde a una necesidad del mismo. -
          </div>

          <div className="contenedor-firma-jefe">
            {firmaJefeDataURL && (
              <img
                className="imagen-firma-render"
                src={firmaJefeDataURL}
                alt="Firma jefe"
              />
            )}
            <div className="linea-firma-jefe">
              {esJefe ? (
                <>
                  {jefe.jefeNombre.toUpperCase()}
                  <br />
                  <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                    {jefe.jefeACargo
                      ? `A cargo del Servicio ${jefe.jefeServicio}`
                      : `Jefe/a del Servicio ${jefe.jefeServicio}`}
                  </span>
                  <br />
                  <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                    {jefe.jefeHospital}
                  </span>
                </>
              ) : (
                <>
                  Firma del Jefe
                  <br />
                  <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>Jefe del Servicio</span>
                  <br />
                  <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>Hospital Pablo Soria</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="linea-separadora-puntos" />

      {/* SECCIÓN 3: RRHH Y SALDOS */}
      <div className="bloque-seccion seccion-rrhh">
        <div className="rrhh-contenido">
          <div style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: 12 }}>
            RRHH <span className="puntos-relleno" style={{ minWidth: 30 }}>{'\u00A0'}</span> de{' '}
            <span className="puntos-relleno" style={{ minWidth: 130 }}>{'\u00A0'}</span> de 20
            <span className="puntos-relleno" style={{ minWidth: 25 }}>{'\u00A0'}</span>
          </div>
          <div className="cuerpo-texto" style={{ textIndent: 0, marginBottom: 10 }}>
            <strong>VISTO:</strong> La presente autorización de licencia, se informa que,{' '}
            <strong>SI / NO</strong> corresponde acceder a lo solicitado, según disposiciones
            vigentes, certificando que le corresponde un total de{' '}
            <span className="puntos-relleno" style={{ minWidth: 40 }}>{'\u00A0'}</span> días compuesto por:
          </div>
          <table className="tabla-rrhh">
            <tbody>
              <tr>
                <td style={{ width: '35%' }}>1) <span className="puntos-relleno" style={{ minWidth: 40 }}>{'\u00A0'}</span> Días corridos por</td>
                <td></td>
              </tr>
              <tr>
                <td style={{ width: '35%' }}>2) <span className="puntos-relleno" style={{ minWidth: 40 }}>{'\u00A0'}</span> Días hábiles por</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div className="rrhh-bottom-wrapper">
            {saldos ? (
              <div className="cuadro-saldos-rrhh">
                <strong>Saldos Verificados de RRHH:</strong>
                <br />
                • LAO: {saldos.laoTotal} días — ({saldos.laoDetalle})
                <br />
                • COMPENSATORIOS: {saldos.compensatorios} Hs.
                <br />• PENDIENTES A LA FECHA: {saldos.actualizacion}
              </div>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            <div className="contenedor-firma-rrhh">
              <div className="linea-firma-rrhh">
                Firma del Jefe R.R.H.H.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(contenido, containerRef.current);
};

export default DocumentoOficialPDF;