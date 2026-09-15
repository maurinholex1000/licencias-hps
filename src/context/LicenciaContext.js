import { createContext, useContext, useState } from 'react';
import { ESTADO_INICIAL_AGENTE, ESTADO_INICIAL_JEFE } from '../utils/constantes';

const LicenciaContext = createContext(null);

export const LicenciaProvider = ({ children }) => {
  const [agente, setAgente] = useState(ESTADO_INICIAL_AGENTE);
  const [jefe, setJefe] = useState(ESTADO_INICIAL_JEFE);
  const [metadatosPdf, setMetadatosPdf] = useState(null);

  const resetAgente = () => setAgente(ESTADO_INICIAL_AGENTE);
  const resetJefe = () => setJefe(ESTADO_INICIAL_JEFE);

  return (
    <LicenciaContext.Provider
      value={{
        agente, setAgente, resetAgente,
        jefe, setJefe, resetJefe,
        metadatosPdf, setMetadatosPdf,
      }}
    >
      {children}
    </LicenciaContext.Provider>
  );
};

export const useLicencia = () => {
  const ctx = useContext(LicenciaContext);
  if (!ctx) throw new Error('useLicencia debe usarse dentro de LicenciaProvider');
  return ctx;
};