import React, { useState, createContext } from 'react';

export const SingnedUserContext = createContext({});

export const SingnedUserProvider = ({ children }) => {
  const [isSingned, setIsSingned] = useState(null);

  return (
    <SingnedUserContext.Provider value={{ isSingned, setIsSingned }}>
      {children}
    </SingnedUserContext.Provider>
  );
};
