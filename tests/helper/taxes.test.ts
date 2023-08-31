import taxes from "@/helper/taxes";

describe("Taxes tests", () => {
  describe("Calculate tax", () => {
    test("Default tax rate", () => {
      const tax = taxes.calculate(100);

      expect(tax).toBe(19);
    });

    test("Custom tax rate", () => {
      const tax = taxes.calculate(100, 0.09);

      expect(tax).toBe(9);
    });
  });

  describe("Add tax to value", () => {
    test("Default tax rate", () => {
      const tax = taxes.addUp(100);

      expect(tax).toBe(119);
    });

    test("Custom tax rate", () => {
      const tax = taxes.addUp(100, 0.09);

      expect(tax).toBe(109);
    });
  });
});
