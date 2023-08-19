const numberToCurrencyString = (n: number | string) => {
  const number = typeof n === "string" ? parseFloat(n) : n;

  return number.toLocaleString("de", {
    currency: "EUR",
    style: "currency",
  });
};

export default numberToCurrencyString;
