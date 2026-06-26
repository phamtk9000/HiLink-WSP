import { createContext, useContext, useState, useCallback, useEffect } from "react";

const SplashCtx = createContext(null);

export const SplashProvider = ({ children }) => {
  const [show, setShow] = useState(true);

  // Auto-dismiss on first load
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // Logo click replays the splash
  const trigger = useCallback(() => {
    setShow(true);
    setTimeout(() => setShow(false), 1800);
  }, []);

  return (
    <SplashCtx.Provider value={{ show, trigger }}>
      {children}
    </SplashCtx.Provider>
  );
};

export const useSplash = () => useContext(SplashCtx);
