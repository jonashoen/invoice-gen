import dateToDateString from "@/helper/dateToDateString";

describe("Date string formatter tests", () => {
  test("With date object", () => {
    const dateString = dateToDateString(new Date(1970, 1, 1));

    expect(dateString).toBe("01. Februar 1970");
  });

  test("With string", () => {
    const dateString = dateToDateString("1970-05-01");

    expect(dateString).toBe("01. Mai 1970");
  });

  test("Without argument", () => {
    jest.useFakeTimers({ now: new Date(2000, 1, 1) });
    const dateString = dateToDateString();
    jest.useRealTimers();

    expect(dateString).toBe("01. Februar 2000");
  });
});
