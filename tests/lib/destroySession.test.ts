import sessionConfig from "@/config/session";
import destroySession from "@/lib/destroySession";
import { StatusCodes } from "http-status-codes";

describe("Session destroy tests", () => {
  test("Destroy session", () => {
    const response = destroySession();

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(StatusCodes.OK);

    const cookie = response.cookies.get(sessionConfig.cookieName);

    expect(cookie).not.toBeUndefined();

    expect(cookie!.name).toBe(sessionConfig.cookieName);
    expect(cookie!.expires!.valueOf()).toBeLessThan(new Date().valueOf());
    expect(cookie!.secure).toBe(true);
    expect(cookie!.httpOnly).toBe(true);
    expect(cookie!.value).toBe("");
  });
});
