import validate from "@/lib/validate";
import Joi from "joi";

const testSchema = Joi.object({
  test: Joi.string().required(),
});

describe("Test body parser", () => {
  test("Validation error", async () => {
    const obj = { foo: "bar" };

    const result = validate(testSchema, obj);

    expect(result).toBeNull();
  });

  test("Validation success", async () => {
    const obj = { test: "Test Content" };

    const result = await validate(testSchema, obj);

    expect(result).toEqual({ ...obj });
  });
});
