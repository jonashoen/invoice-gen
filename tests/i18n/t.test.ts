import t from "@/i18n/t";

describe("i18n tests", () => {
  test("Key doesn't exist", () => {
    const translation = t("invalid_key", "de");

    expect(translation).toBe("invalid_key");
  });

  test("Key exists", () => {
    const translation = t("month", "de");

    expect(translation).toBe("Monat");
  });

  test("Default language is german", () => {
    const translation = t("month");

    expect(translation).toBe("Monat");
  });
});
