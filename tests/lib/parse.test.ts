import BaseRequest from "@/interfaces/requests/BaseRequest";
import parse from "@/lib/parse";
import Joi from "joi";

const testSchema = Joi.object({
  test: Joi.string().required(),
});

interface TestRequest {
  test: string;
}

describe("Test body parser", () => {
  test("Validation error", async () => {
    const request = {
      json: () => ({ foo: "bar" }),
    } as any as BaseRequest<TestRequest>;

    const result = await parse(testSchema, request);

    expect(result).toBeNull();
  });

  test("Validation success", async () => {
    const request = {
      json: (): TestRequest => ({ test: "Test Content" }),
    } as any as BaseRequest<TestRequest>;

    const result = await parse(testSchema, request);

    expect(result).toEqual({
      ...request.json(),
    });
  });
});
