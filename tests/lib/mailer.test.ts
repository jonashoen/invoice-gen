import mailer from "@/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const consoleMock = jest.spyOn(console, "error").mockImplementation();

const mailerMock = jest.fn();
jest.mock(
  "nodemailer",
  jest.fn().mockImplementation(() => ({
    createTransport: () => ({
      sendMail: () => mailerMock(),
    }),
  }))
);

describe("Mailer tests", () => {
  describe("Send account verification mail", () => {
    test("Mailer fails", async () => {
      mailerMock.mockRejectedValueOnce(undefined);

      const result = await mailer.sendVerificationMail({
        to: "Test To",
        code: "Test Code",
      });

      expect(consoleMock).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    test("Mailer succeds", async () => {
      mailerMock.mockResolvedValueOnce({});

      const result = await mailer.sendVerificationMail({
        to: "Test To",
        code: "Test Code",
      });

      expect(result).toEqual({});
    });
  });

  describe("Send reset password mail", () => {
    test("Mailer fails", async () => {
      mailerMock.mockRejectedValueOnce(undefined);

      const result = await mailer.sendResetPasswordMail({
        to: "Test To",
        code: "Test Code",
      });

      expect(consoleMock).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    test("Mailer succeds", async () => {
      mailerMock.mockResolvedValueOnce({});

      const result = await mailer.sendResetPasswordMail({
        to: "Test To",
        code: "Test Code",
      });

      expect(result).toEqual({});
    });
  });
});
