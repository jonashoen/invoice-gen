const defaultTaxRate = 0.19;

const calculate = (n: number, taxRate = defaultTaxRate) => n * taxRate;

const addUp = (n: number, taxRate = defaultTaxRate) =>
  n + calculate(n, taxRate);

export default { calculate, addUp };
