import sessionConfig from "@/config/session";
import isAuthed from "@/lib/isAuthed";
import cookieSignature from "cookie-signature";

const cookiesMock = jest.fn();
jest.mock(
  "next/headers",
  jest.fn().mockImplementation(() => ({
    cookies: () => cookiesMock(),
  }))
);

const sessionCheckMock = jest.fn();
jest.mock(
  "@/services/user",
  jest.fn().mockImplementation(() => ({
    checkSession: () => sessionCheckMock(),
  }))
);

describe("Is user authed tests", () => {
  test("No auth cookie provided", async () => {
    cookiesMock.mockReturnValueOnce({ get: () => null });

    const session = await isAuthed();

    expect(session).toBeNull();
  });

  test("Invalid session id provided", async () => {
    const sessionId = "Session id without signature";

    cookiesMock.mockReturnValueOnce({ get: () => ({ value: sessionId }) });

    const session = await isAuthed();

    expect(session).toBeNull();
  });

  test("Session id not in db", async () => {
    const sessionId = "Session id without signature";
    const signedSessionId = cookieSignature.sign(
      sessionId,
      sessionConfig.signKey
    );

    cookiesMock.mockReturnValueOnce({
      get: () => ({ value: signedSessionId }),
    });

    sessionCheckMock.mockResolvedValueOnce(null);

    const session = await isAuthed();

    expect(session).toBeNull();
  });

  test("Valid session id", async () => {
    const sessionId = "Session id without signature";
    const signedSessionId = cookieSignature.sign(
      sessionId,
      sessionConfig.signKey
    );

    const userId = -1;

    cookiesMock.mockReturnValueOnce({
      get: () => ({ value: signedSessionId }),
    });

    sessionCheckMock.mockResolvedValueOnce(userId);

    const session = await isAuthed();

    expect(session).toBe(userId);
  });
});
