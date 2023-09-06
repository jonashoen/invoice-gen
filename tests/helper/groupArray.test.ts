import dateToDateString from "@/helper/dateToDateString";
import group from "@/helper/groupArray";

describe("Group array tests", () => {
  test("Grouping by key", () => {
    const array = [
      { foo: 1, bar: "ABC" },
      { foo: 1, bar: "DEF" },
      { foo: 2, bar: "GHI" },
    ];

    const groups = group(array, { key: "foo" });

    expect(groups[1]).toBeDefined();
    expect(groups[2]).toBeDefined();

    expect(groups[1]).toHaveLength(2);
    expect(groups[2]).toHaveLength(1);
  });

  test("Grouping by callback", () => {
    const array = [
      { foo: new Date(1970, 1, 1), bar: "ABC" },
      { foo: new Date(1970, 1, 1), bar: "DEF" },
      { foo: new Date(2000, 1, 1), bar: "GHI" },
    ];

    const groups = group(array, { cb: (item) => dateToDateString(item.foo) });

    expect(groups[dateToDateString(array[0].foo)]).toBeDefined();
    expect(groups[dateToDateString(array[2].foo)]).toBeDefined();

    expect(groups[dateToDateString(array[0].foo)]).toHaveLength(2);
    expect(groups[dateToDateString(array[2].foo)]).toHaveLength(1);
  });
});
