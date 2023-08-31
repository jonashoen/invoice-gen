import numberToCurrencyString from "@/helper/numberToCurrencyString";

describe("Currency string formatter tests", () => {
  test("With number", () => {
    const currencyString = numberToCurrencyString(2.976);

    expect(currencyString.replace(/\s/, "")).not.toBe(currencyString);
    expect(currencyString.replace(/\s/, "")).toBe("2,98€");
  });

  test("With string", () => {
    const currencyString = numberToCurrencyString("12.432");

    expect(currencyString.replace(/\s/, "")).not.toBe(currencyString);
    expect(currencyString.replace(/\s/, "")).toBe("12,43€");
  });
});
