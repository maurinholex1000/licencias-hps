import FirmaDigital from '../common/FirmaDigital';

const FirmaAgenteStep = ({ firma }) => (
  <fieldset className="form-section">
    <legend className="visually-hidden">Firma Digital del Agente</legend>
    <h3>5. Firma Digital del Agente</h3>
    <FirmaDigital firma={firma} altoInicial={150} label="" />
  </fieldset>
);

export default FirmaAgenteStep;