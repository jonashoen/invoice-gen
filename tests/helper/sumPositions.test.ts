import sumPositions from "@/helper/sumPositions";
import { InvoicePosition } from "@prisma/client";

describe("Sum invoice positions tests", () => {
  test("One position", () => {
    const positions: InvoicePosition[] = [
      {
        amount: 20,
        description: "",
        price: 10,
        unit: "hours",
        id: -1,
        invoiceId: -1,
      },
    ];

    const sum = sumPositions(positions);

    expect(sum).toBe(200);
  });

  test("Multiple positions", () => {
    const positions: InvoicePosition[] = [
      {
        amount: 20,
        description: "",
        price: 10,
        unit: "hours",
        id: -1,
        invoiceId: -1,
      },
      {
        amount: 30,
        description: "",
        price: 20,
        unit: "hours",
        id: -1,
        invoiceId: -1,
      },
      {
        amount: 0.25,
        description: "",
        price: 100,
        unit: "hours",
        id: -1,
        invoiceId: -1,
      },
    ];

    const sum = sumPositions(positions);

    expect(sum).toBe(200 + 600 + 25);
  });
});
