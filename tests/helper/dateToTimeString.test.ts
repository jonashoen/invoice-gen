import dateToTimeString from "@/helper/dateToTimeString";

describe("Date to time string formatter tests", () => {
  test("With date object", () => {
    const timeString = dateToTimeString(new Date(1970, 1, 1, 12, 0, 0));

    expect(timeString).toBe("12:00");
  });

  test("Include seconds", () => {
    const timeString = dateToTimeString(new Date(1970, 1, 1, 12, 0, 24), true);

    expect(timeString).toBe("12:00:24");
  });

  test("With string", () => {
    const dateString = "1970-05-01T20:25:00Z";

    const timeString = dateToTimeString(dateString);

    const hours = new Date(dateString).getHours().toString().padStart(2, "0");

    expect(timeString).toBe(`${hours}:25`);
  });

  test("Without argument", () => {
    jest.useFakeTimers({ now: new Date(2000, 1, 1, 6, 12, 0) });
    const timeString = dateToTimeString();
    jest.useRealTimers();

    expect(timeString).toBe("06:12");
  });
});
