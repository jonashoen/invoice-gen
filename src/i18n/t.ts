import de from "./de.json";

type Languages = "de";

const translations: Record<Languages, Record<string, string>> = {
  de,
};

const t = (key: string, language: Languages = "de") => {
  if (key in translations[language]) {
    return translations[language][key];
  } else {
    return key;
  }
};

export default t;
