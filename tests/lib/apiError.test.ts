import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";

describe("Api error tests", () => {
  test("Create api error", () => {
    const error = apiError(StatusCodes.UNAUTHORIZED);

    expect(error).toBeInstanceOf(Response);
    expect(error.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
