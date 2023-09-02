const oldEnvMailer = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...oldEnvMailer };
});

afterAll(() => {
  process.env = oldEnvMailer;
});

describe("Mailer config tests", () => {
  test("Host env var present", async () => {
    delete process.env.MAIL_HOST;

    expect(() => import("@/config/mailer")).rejects.toThrow();
  });

  test("Port env var present", async () => {
    delete process.env.MAIL_PORT;

    expect(() => import("@/config/mailer")).rejects.toThrow();
  });

  test("User env var present", async () => {
    delete process.env.MAIL_USER;

    expect(() => import("@/config/mailer")).rejects.toThrow();
  });

  test("Password env var present", async () => {
    delete process.env.MAIL_PASSWORD;

    expect(() => import("@/config/mailer")).rejects.toThrow();
  });

  test("From env var present", async () => {
    delete process.env.MAIL_FROM;

    expect(() => import("@/config/mailer")).rejects.toThrow();
  });
});
