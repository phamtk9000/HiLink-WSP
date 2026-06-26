import { createContext, useContext, useState } from "react";

export const LanguageContext = createContext({ lang:"en", toggle:()=>{} });

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");
  return (
    <LanguageContext.Provider value={{ lang, toggle:()=>setLang(l=>l==="en"?"vi":"en") }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
