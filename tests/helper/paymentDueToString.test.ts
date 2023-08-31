import paymentDueToString from "@/helper/paymentDueToString";

describe("Payment due string tests", () => {
  describe("Days", () => {
    test("Multiple", () => {
      const paymentDueString = paymentDueToString({
        paymentDue: 5,
        paymentDueUnit: "days",
      });

      expect(paymentDueString).toBe("5 Tagen");
    });
  });

  describe("Weeks", () => {
    test("One", () => {
      const paymentDueString = paymentDueToString({
        paymentDue: 1,
        paymentDueUnit: "week",
      });

      expect(paymentDueString).toBe("1 Woche");
    });

    test("Multiple", () => {
      const paymentDueString = paymentDueToString({
        paymentDue: 5,
        paymentDueUnit: "weeks",
      });

      expect(paymentDueString).toBe("5 Wochen");
    });
  });

  describe("Months", () => {
    test("One", () => {
      const paymentDueString = paymentDueToString({
        paymentDue: 1,
        paymentDueUnit: "month",
      });

      expect(paymentDueString).toBe("1 Monat");
    });

    test("Multiple", () => {
      const paymentDueString = paymentDueToString({
        paymentDue: 5,
        paymentDueUnit: "months",
      });

      expect(paymentDueString).toBe("5 Monaten");
    });
  });
});
