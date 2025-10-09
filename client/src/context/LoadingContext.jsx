import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);

  const showLoading = () => setGlobalLoading(true);
  const hideLoading = () => setGlobalLoading(false);

  return (
    <LoadingContext.Provider value={{ globalLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading() {
  return useContext(LoadingContext);
}