const oldEnvSession = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...oldEnvSession };
});

afterAll(() => {
  process.env = oldEnvSession;
});

describe("Session config tests", () => {
  test("Cookie signature key env var present", async () => {
    delete process.env.COOKIE_SIGNATURE_KEY;

    expect(() => import("@/config/session")).rejects.toThrow();
  });
});
