import userService from "@/services/user";
import { prismaMock } from "../__helper/mockDb";
import { User, Profile, UserVerify } from "@prisma/client";
import password from "@/lib/password";
import dayjs from "dayjs";

const mailerMockVerify = jest.fn();
const mailerMockReset = jest.fn();
jest.mock(
  "@/lib/mailer",
  jest.fn().mockImplementation(() => ({
    sendVerificationMail: (props: any) =>
      Promise.resolve(mailerMockVerify(props)),
    sendResetPasswordMail: (props: any) =>
      Promise.resolve(mailerMockReset(props)),
  }))
);

const testUser: User & Profile = {
  id: -1,
  username: "Test Username",
  password: "Test Password",
  createdAt: new Date(),
  verified: true,
  verifiedAt: new Date(),
  userId: -1,
  firstName: "Test First Name",
  lastName: "Test Last Name",
  zipCode: "Test Zipcode",
  city: "Test City",
  street: "Test Street",
  houseNumber: "Test House Number",
  bank: "Test Bank",
  iban: "Test IBAN",
  bic: "Test BIC",
  taxNumber: "Test Tax Number",
  vatId: "Test Vat Id",
  telephone: "Test Telephone Number",
  email: "Test Email Address",
};

describe("User service tests", () => {
  describe("Register", () => {
    test("Passwords don't match", async () => {
      const user = await userService.register({
        ...testUser,
        passwordRepeated: "Another password",
      });

      expect(user).toBeNull();
    });

    test("Username or email already exists", async () => {
      prismaMock.user.findFirst.mockResolvedValueOnce(testUser);

      const user = await userService.register({
        ...testUser,
        passwordRepeated: testUser.password,
      });

      expect(user).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.user.findFirst.mockResolvedValueOnce(null);
      prismaMock.user.create.mockResolvedValueOnce(testUser);

      const user = await userService.register({
        ...testUser,
        passwordRepeated: testUser.password,
      });

      expect(user).toEqual(testUser);
      expect(mailerMockVerify).toHaveBeenCalledTimes(1);
    });
  });

  describe("Login tests", () => {
    test("User doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const user = await userService.login({
        username: "non existing user",
        password: testUser.password,
      });

      expect(user).toBeNull();
    });

    test("Wrong password", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(testUser);

      const user = await userService.login({
        username: testUser.username,
        password: "wrong password",
      });

      expect(user).toBeNull();
    });

    test("Unverified user", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...testUser,
        password: password.hash(testUser.password),
        verified: false,
      });

      const user = await userService.login({
        username: testUser.username,
        password: testUser.password,
      });

      expect(user).not.toBeNull();
      expect(user!.userId).toBe(testUser.id);
      expect(user!.sessionId).toBeNull();
      expect(user!.expires).toBeNull();
    });

    test("Valid credentials", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...testUser,
        password: password.hash(testUser.password),
      });

      const sessionId = "Test Session Id";
      const expires = new Date();

      prismaMock.session.upsert.mockResolvedValueOnce({
        userId: testUser.id,
        sessionId,
        expires,
      });

      const user = await userService.login({
        username: testUser.username,
        password: testUser.password,
      });

      expect(user).not.toBeNull();
      expect(user!.userId).toBe(testUser.id);
      expect(user!.sessionId).toBe("Test Session Id");
      expect(user!.expires!.valueOf()).toBe(expires.valueOf());
    });
  });

  test("Logout tests", async () => {
    prismaMock.session.delete.mockResolvedValueOnce({
      userId: testUser.id,
      sessionId: "",
      expires: new Date(),
    });

    const user = await userService.logout(testUser.id);

    expect(user.userId).toBe(testUser.id);
  });

  describe("Check session test", () => {
    test("Invalid session id", async () => {
      prismaMock.session.findUnique.mockResolvedValueOnce(null);

      const sessionUserId = await userService.checkSession({ sessionId: "" });

      expect(sessionUserId).toBeNull();
    });

    test("Session is expired", async () => {
      prismaMock.session.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        sessionId: "",
        expires: dayjs.utc().subtract(1, "hour").toDate(),
      });

      const sessionUserId = await userService.checkSession({ sessionId: "" });

      expect(sessionUserId).toBeNull();
    });

    test("Valid session", async () => {
      prismaMock.session.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        sessionId: "",
        expires: dayjs.utc().add(1, "hour").toDate(),
      });

      const sessionUserId = await userService.checkSession({ sessionId: "" });

      expect(sessionUserId).toBe(testUser.id);
    });
  });

  describe("Get user", () => {
    test("User doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const user = await userService.get(testUser.id);

      expect(user).toBeNull();
    });

    test("Valid user", async () => {
      const userWithProfile: User & { profile: Profile } = {
        id: testUser.id,
        username: testUser.username,
        password: testUser.password,
        createdAt: testUser.createdAt,
        verified: testUser.verified,
        verifiedAt: testUser.verifiedAt,
        profile: {
          userId: testUser.userId,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          zipCode: testUser.zipCode,
          city: testUser.city,
          street: testUser.street,
          houseNumber: testUser.houseNumber,
          bank: testUser.bank,
          iban: testUser.iban,
          bic: testUser.bic,
          taxNumber: testUser.taxNumber,
          vatId: testUser.vatId,
          telephone: testUser.telephone,
          email: testUser.email,
        },
      };

      prismaMock.user.findUnique.mockResolvedValueOnce(userWithProfile);

      const user = await userService.get(testUser.id);

      expect(user).toEqual(userWithProfile);
    });
  });

  describe("Edit user tests", () => {
    test("User doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const user = await userService.edit(testUser.id, {});

      expect(user).toBeNull();
    });

    test("Username already exists", async () => {
      const newUserName = "New username";

      prismaMock.user.findUnique.mockResolvedValueOnce(testUser);
      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...testUser,
        username: newUserName,
      });

      const user = await userService.edit(testUser.id, {
        username: newUserName,
      });

      expect(user).toBeNull();
    });

    test("Email already exists", async () => {
      const newEmailAddress = "New email address";

      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...testUser,
        profile: {
          ...testUser,
        },
      } as any);

      prismaMock.profile.findFirst.mockResolvedValueOnce({
        ...testUser,
        email: newEmailAddress,
      });

      const user = await userService.edit(testUser.id, {
        email: newEmailAddress,
      });

      expect(user).toBeNull();
    });

    test("Valid edit", async () => {
      const newEmailAddress = "New email address";

      prismaMock.user.findUnique.mockResolvedValueOnce(testUser);
      prismaMock.user.update.mockResolvedValueOnce(testUser);

      const user = await userService.edit(testUser.id, {
        firstName: "Jens",
      });

      expect(user).toHaveProperty("id");
      expect(user!.id).toBe(testUser.id);

      expect(user).toHaveProperty("username");
      expect(user!.username).toBe(testUser.username);

      expect(user).toHaveProperty("password");
      expect(user!.password).toBe(testUser.password);

      expect(user).toHaveProperty("createdAt");
      expect(user!.createdAt).toBe(testUser.createdAt);

      expect(user).toHaveProperty("verified");
      expect(user!.verified).toBe(testUser.verified);

      expect(user).toHaveProperty("verifiedAt");
      expect(user!.verifiedAt).toBe(testUser.verifiedAt);
    });
  });

  describe("Forgot password tests", () => {
    test("New passwords don't match", async () => {
      const user = await userService.changePassword(testUser.userId, {
        oldPassword: "",
        newPassword: "New password",
        newPasswordRepeated: "Wrong new password",
      });

      expect(user).toBeNull();
    });

    test("User doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const user = await userService.changePassword(testUser.userId, {
        oldPassword: "",
        newPassword: "New password",
        newPasswordRepeated: "New password",
      });

      expect(user).toBeNull();
    });

    test("Old password wrong", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(testUser);

      const user = await userService.changePassword(testUser.userId, {
        oldPassword: "Wrong old password",
        newPassword: "New password",
        newPasswordRepeated: "New password",
      });

      expect(user).toBeNull();
    });

    test("Valid data", async () => {
      const newPassword = "New password";

      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...testUser,
        password: password.hash(testUser.password),
      });

      prismaMock.user.update.mockResolvedValueOnce({
        ...testUser,
        password: password.hash(newPassword),
      });

      const user = await userService.changePassword(testUser.userId, {
        oldPassword: testUser.password,
        newPassword,
        newPasswordRepeated: newPassword,
      });

      expect(user).toHaveProperty("id");
      expect(user!.id).toBe(testUser.id);

      expect(user).toHaveProperty("username");
      expect(user!.username).toBe(testUser.username);

      expect(user).toHaveProperty("password");
      expect(password.compare(newPassword, user!.password)).toBe(true);

      expect(user).toHaveProperty("createdAt");
      expect(user!.createdAt).toBe(testUser.createdAt);

      expect(user).toHaveProperty("verified");
      expect(user!.verified).toBe(testUser.verified);

      expect(user).toHaveProperty("verifiedAt");
      expect(user!.verifiedAt).toBe(testUser.verifiedAt);
    });
  });

  describe("Request reset password tests", () => {
    test("Profile doesn't exist", async () => {
      prismaMock.profile.findFirst.mockResolvedValueOnce(null);

      const profile = await userService.requestResetPassword({ email: "" });

      expect(profile).toBeNull();
    });

    test("Profile does exist", async () => {
      prismaMock.profile.findFirst.mockResolvedValueOnce(testUser);

      let code: undefined | string;
      prismaMock.userPasswordReset.upsert.mockImplementationOnce(
        ({ create }) => {
          code = (create as any).code;

          return Promise.resolve(testUser) as any;
        }
      );

      let emailCode: undefined | string;
      mailerMockReset.mockImplementationOnce(({ code }) => {
        emailCode = code;
      });

      const profile = await userService.requestResetPassword({ email: "" });

      expect(profile).not.toBeNull();
      expect(code).toBeDefined();
      expect(emailCode).toBeDefined();

      expect(password.compare(emailCode!, code!)).toBe(true);
    });
  });

  describe("Test check reset password code", () => {
    test("Profile doesn't exist", async () => {
      prismaMock.profile.findFirst.mockResolvedValueOnce(null);

      const result = await userService.checkResetPasswordCode({
        email: "",
        code: "",
      });

      expect(result).toBeNull();
    });

    test("Password reset doesn't exist", async () => {
      prismaMock.profile.findFirst.mockResolvedValueOnce(testUser);
      prismaMock.userPasswordReset.findUnique.mockResolvedValueOnce(null);

      const result = await userService.checkResetPasswordCode({
        email: "",
        code: "",
      });

      expect(result).toBeNull();
    });

    test("Wrong code", async () => {
      const code = "123456";

      prismaMock.profile.findFirst.mockResolvedValueOnce(testUser);
      prismaMock.userPasswordReset.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        code: code.split("").reverse().join(""),
        expires: dayjs.utc().add(1, "day").toDate(),
      });

      const result = await userService.checkResetPasswordCode({
        email: "",
        code,
      });

      expect(result).toBeNull();
    });

    test("Code is expired", async () => {
      const code = "123456";

      prismaMock.profile.findFirst.mockResolvedValueOnce(testUser);
      prismaMock.userPasswordReset.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        code: password.hash(code),
        expires: dayjs.utc().subtract(1, "day").toDate(),
      });

      const result = await userService.checkResetPasswordCode({
        email: "",
        code,
      });

      expect(result).toBeNull();
    });

    test("Valid data", async () => {
      const code = "123456";

      prismaMock.profile.findFirst.mockResolvedValueOnce(testUser);
      prismaMock.userPasswordReset.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        code: password.hash(code),
        expires: dayjs.utc().add(1, "day").toDate(),
      });

      const result = await userService.checkResetPasswordCode({
        email: "",
        code,
      });

      expect(result).toBe(true);
    });
  });

  describe("Reset password tests", () => {
    test("New passwords don't match", async () => {
      const user = await userService.resetPassword({
        email: "",
        code: "",
        newPassword: "New password",
        newPasswordRepeated: "Wrong new password",
      });

      expect(user).toBeNull();
    });

    test("Invalid code", async () => {
      const code = "123456";

      prismaMock.profile.findFirst.mockResolvedValueOnce(testUser);
      prismaMock.userPasswordReset.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        code: code.split("").reverse().join(""),
        expires: dayjs.utc().add(1, "day").toDate(),
      });

      const user = await userService.resetPassword({
        email: "",
        code,
        newPassword: "New password",
        newPasswordRepeated: "New password",
      });

      expect(user).toBeNull();
    });

    test("Valid data", async () => {
      const code = "123456";

      prismaMock.profile.findFirst.mockResolvedValueOnce(testUser);
      prismaMock.userPasswordReset.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        code: password.hash(code),
        expires: dayjs.utc().add(1, "day").toDate(),
      });
      prismaMock.profile.findFirst.mockResolvedValueOnce(testUser);
      prismaMock.user.update.mockResolvedValueOnce(testUser);

      const user = await userService.resetPassword({
        email: "",
        code,
        newPassword: "New password",
        newPasswordRepeated: "New password",
      });

      expect(user).toHaveProperty("id");
      expect(user!.id).toBe(testUser.id);

      expect(user).toHaveProperty("username");
      expect(user!.username).toBe(testUser.username);

      expect(user).toHaveProperty("password");
      expect(user!.password).toBe(testUser.password);

      expect(user).toHaveProperty("createdAt");
      expect(user!.createdAt).toBe(testUser.createdAt);

      expect(user).toHaveProperty("verified");
      expect(user!.verified).toBe(testUser.verified);

      expect(user).toHaveProperty("verifiedAt");
      expect(user!.verifiedAt).toBe(testUser.verifiedAt);
    });
  });

  describe("Verify user tests", () => {
    test("User doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const session = await userService.verify({
        username: testUser.username,
        code: "",
      });

      expect(session).toBeNull();
    });

    test("User verify doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(testUser);
      prismaMock.userVerify.findUnique.mockResolvedValueOnce(null);

      const session = await userService.verify({
        username: testUser.username,
        code: "",
      });

      expect(session).toBeNull();
    });

    test("Invalid code", async () => {
      const code = "123456";

      prismaMock.user.findUnique.mockResolvedValueOnce(testUser);
      prismaMock.userVerify.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        code: code.split("").reverse().join(""),
      });

      const session = await userService.verify({
        username: testUser.username,
        code,
      });

      expect(session).toBeNull();
    });

    test("Valid code", async () => {
      const code = "123456";
      const sessionId = "Session Id";
      const expires = new Date();

      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...testUser,
        profile: {
          ...testUser,
        },
      } as any);
      prismaMock.userVerify.findUnique.mockResolvedValueOnce({
        userId: testUser.id,
        code: password.hash(code),
      });
      prismaMock.user.update.mockResolvedValueOnce(testUser);
      prismaMock.user.deleteMany.mockResolvedValueOnce({} as any);
      prismaMock.session.upsert.mockResolvedValueOnce({
        userId: testUser.id,
        sessionId,
        expires,
      });

      const session = await userService.verify({
        username: testUser.username,
        code,
      });

      expect(session!.userId).toBe(testUser.id);
      expect(session!.sessionId).toBe(sessionId);
      expect(session!.expires.valueOf()).toBe(expires.valueOf());
    });
  });

  describe("Resend verify code tests", () => {
    test("User doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const verify = await userService.resendVerifyCode({ username: "" });

      expect(verify).toBeNull();
    });

    test("User already verified", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(testUser);

      const verify = await userService.resendVerifyCode({ username: "" });

      expect(verify).toBeNull();
    });

    test("No user verify exists", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...testUser,
        verified: false,
      });
      prismaMock.userVerify.findUnique.mockResolvedValueOnce(null);

      const verify = await userService.resendVerifyCode({ username: "" });

      expect(verify).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...testUser,
        verified: false,
        profile: {
          ...testUser,
        },
      } as any);
      prismaMock.userVerify.findUnique.mockResolvedValueOnce({} as UserVerify);

      prismaMock.userVerify.update.mockImplementationOnce(
        ({ data }) =>
          Promise.resolve({ userId: testUser.id, code: data.code }) as any
      );

      let mailCode: undefined | string;
      mailerMockVerify.mockImplementationOnce(({ code }) => {
        mailCode = code;
      });

      const verify = await userService.resendVerifyCode({ username: "" });

      expect(verify!.userId).toBe(testUser.id);
      expect(password.compare(mailCode!, verify!.code)).toBe(true);
    });
  });

  describe("Check username tests", () => {
    test("User doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const userExists = await userService.checkUsername(testUser.username);

      expect(userExists).toBe(false);
    });

    test("User does exist", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({} as User);

      const userExists = await userService.checkUsername(testUser.username);

      expect(userExists).toBe(true);
    });
  });

  describe("Check email tests", () => {
    test("Email doesn't exist", async () => {
      prismaMock.user.findFirst.mockResolvedValueOnce(null);

      const emailExists = await userService.checkEmail(testUser.email);

      expect(emailExists).toBe(false);
    });

    test("User does exist", async () => {
      prismaMock.user.findFirst.mockResolvedValueOnce({} as User);

      const emailExists = await userService.checkEmail(testUser.email);

      expect(emailExists).toBe(true);
    });
  });
});
