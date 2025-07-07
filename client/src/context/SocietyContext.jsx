import { createContext, useContext, useState } from 'react';

const SocietyContext = createContext();

export const useSociety = () => useContext(SocietyContext);

export const SocietyProvider = ({ children }) => {
  const [society, setSociety] = useState(null);

  return (
    <SocietyContext.Provider value={{ society, setSociety }}>
      {children}
    </SocietyContext.Provider>
  );
};
