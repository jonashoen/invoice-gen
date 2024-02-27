import de from "./de.json";

type Language = "de";

const translations: Record<Language, Record<string, string>> = {
  de,
};

const t = (key: string, language: Language = "de") => {
  if (key in translations[language]) {
    return translations[language][key];
  } else {
    return key;
  }
};

export default t;
