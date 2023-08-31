import sessionConfig from "@/config/session";
import createSession from "@/lib/createSession";
import { StatusCodes } from "http-status-codes";
import cookieSignature from "cookie-signature";

describe("Session creation tests", () => {
  test("Create session", () => {
    const sessionId = "Test Session Id";

    const response = createSession(sessionId);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(StatusCodes.OK);

    const cookie = response.cookies.get(sessionConfig.cookieName);

    expect(cookie).not.toBeUndefined();

    expect(cookie!.name).toBe(sessionConfig.cookieName);
    expect(cookie!.maxAge).toBe(sessionConfig.maxAge);
    expect(cookie!.secure).toBe(true);
    expect(cookie!.httpOnly).toBe(true);
    expect(cookieSignature.unsign(cookie!.value, sessionConfig.signKey)).toBe(
      sessionId
    );
  });
});
