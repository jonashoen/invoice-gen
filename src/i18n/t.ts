import de from "./de.json";

type Languages = "de";

const translations = {
  de,
};

const t = (key: string, language: Languages = "de") => {
  if (key in translations[language]) {
    return (de as any)[key];
  } else {
    return key;
  }
};

export default t;
