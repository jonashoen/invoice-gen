import crypto from "crypto";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import db from "@/db";
import sessionConfig from "@/config/session";
import passwordHelper from "@/lib/password";
import mailer from "@/lib/mailer";
import passwordConfig from "@/config/password";

dayjs.extend(utc);

const register = async ({
  username,
  password,
  passwordRepeated,
  firstName,
  lastName,
  zipCode,
  city,
  street,
  houseNumber,
  bank,
  iban,
  bic,
  taxNumber,
  vatId,
  telephone,
  email,
}: {
  username: string;
  password: string;
  passwordRepeated?: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  city: string;
  street: string;
  houseNumber: string;
  bank: string;
  iban: string;
  bic: string;
  taxNumber: string;
  vatId: string;
  telephone: string;
  email: string;
}) => {
  if (password !== passwordRepeated) {
    return null;
  }

  const oldUser = await db.user.findFirst({
    where: { OR: [{ username }, { profile: { email }, verified: true }] },
  });

  if (oldUser) {
    return null;
  }

  const verifyCode = generateCode();

  const user = await db.user.create({
    data: {
      username,
      password: passwordHelper.hash(password),
      profile: {
        create: {
          firstName,
          lastName,
          zipCode,
          city,
          street,
          houseNumber,
          bank,
          iban,
          bic,
          taxNumber,
          vatId,
          telephone,
          email,
        },
      },
      verify: {
        create: {
          code: passwordHelper.hash(verifyCode),
        },
      },
    },
  });

  await mailer.sendVerificationMail({
    to: email,
    code: verifyCode,
  });

  return user;
};

const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  const passwordCorrect = passwordHelper.compare(password, user.password);

  if (!passwordCorrect) {
    return null;
  }

  if (!user.verified) {
    await resendVerifyCode({ username: user.username });

    return { userId: user.id, sessionId: null, expires: null };
  }

  return await createSession(user.id);
};

const logout = async (userId: number) => {
  return await db.session.delete({
    where: {
      userId,
    },
  });
};

const createSession = async (userId: number) => {
  const expires = dayjs.utc().add(sessionConfig.maxAge, "seconds").toDate();

  return await db.session.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      sessionId: crypto.randomUUID(),
      expires,
    },
    update: {
      sessionId: crypto.randomUUID(),
      expires,
    },
  });
};

const checkSession = async ({ sessionId }: { sessionId: string }) => {
  const session = await db.session.findUnique({
    where: {
      sessionId,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expires.valueOf() < dayjs.utc().valueOf()) {
    return null;
  }

  return session.userId;
};

const get = async (userId: number) => {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      createdAt: true,
      username: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          zipCode: true,
          city: true,
          street: true,
          houseNumber: true,
          bank: true,
          iban: true,
          bic: true,
          taxNumber: true,
          vatId: true,
          telephone: true,
          email: true,
        },
      },
    },
  });
};

const edit = async (
  id: number,
  {
    username,
    firstName,
    lastName,
    zipCode,
    city,
    street,
    houseNumber,
    bank,
    iban,
    bic,
    taxNumber,
    vatId,
    telephone,
    email,
  }: {
    username?: string;
    firstName?: string;
    lastName?: string;
    zipCode?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    bank?: string;
    iban?: string;
    bic?: string;
    taxNumber?: string;
    vatId?: string;
    telephone?: string;
    email?: string;
  }
) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    return null;
  }

  if (username && user.username !== username) {
    const userUsername = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (userUsername) {
      return null;
    }
  }

  if (email && user.profile!.email !== email) {
    const userEmail = await db.profile.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (userEmail) {
      return null;
    }
  }

  return await db.user.update({
    where: {
      id,
    },
    data: {
      username,
      verify: {},
      profile: {
        update: {
          firstName,
          lastName,
          zipCode,
          city,
          street,
          houseNumber,
          bank,
          iban,
          bic,
          taxNumber,
          vatId,
          telephone,
          email,
        },
      },
    },
  });
};

const changePassword = async (
  id: number,
  {
    oldPassword,
    newPassword,
    newPasswordRepeated,
  }: { oldPassword: string; newPassword: string; newPasswordRepeated?: string }
) => {
  if (newPassword !== newPasswordRepeated) {
    return null;
  }

  const user = await db.user.findUnique({ where: { id } });

  if (!user) {
    return null;
  }

  if (!passwordHelper.compare(oldPassword, user.password)) {
    return null;
  }

  return await db.user.update({
    where: {
      id,
    },
    data: {
      password: passwordHelper.hash(newPassword),
    },
  });
};

const requestResetPassword = async ({ email }: { email: string }) => {
  const profile = await db.profile.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  if (!profile) {
    return null;
  }

  const code = generateCode();

  await db.userPasswordReset.upsert({
    where: {
      userId: profile.userId,
    },
    create: {
      userId: profile.userId,
      code: passwordHelper.hash(code),
      expires: dayjs.utc().add(passwordConfig.maxAge, "seconds").toDate(),
    },
    update: {
      userId: profile.userId,
      code: passwordHelper.hash(code),
      expires: dayjs.utc().add(passwordConfig.maxAge, "seconds").toDate(),
    },
  });

  await mailer.sendResetPasswordMail({ to: email, code });
};

const checkResetPasswordCode = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const profile = await db.profile.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  if (!profile) {
    return null;
  }

  const passwordReset = await db.userPasswordReset.findUnique({
    where: {
      userId: profile.userId,
    },
  });

  if (!passwordReset) {
    return null;
  }

  if (
    !passwordHelper.compare(code, passwordReset.code) ||
    dayjs.utc().isAfter(dayjs.utc(passwordReset.expires))
  ) {
    return null;
  }

  return true;
};

const resetPassword = async ({
  email,
  code,
  newPassword,
  newPasswordRepeated,
}: {
  email: string;
  code: string;
  newPassword: string;
  newPasswordRepeated?: string;
}) => {
  if (newPassword !== newPasswordRepeated) {
    return null;
  }

  const codeValid = await checkResetPasswordCode({ email, code });

  if (!codeValid) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  return await db.user.update({
    where: {
      id: profile!.userId,
    },
    data: {
      password: passwordHelper.hash(newPassword),
      passwordReset: {
        delete: true,
      },
    },
  });
};

const verify = async ({
  username,
  code,
}: {
  username: string;
  code: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  const userVerify = await db.userVerify.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userVerify) {
    return null;
  }

  if (!passwordHelper.compare(code, userVerify.code)) {
    return null;
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      verified: true,
      verifiedAt: dayjs.utc().toDate(),
      verify: {
        delete: true,
      },
    },
  });

  return createSession(user.id);
};

const resendVerifyCode = async ({ username }: { username: string }) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    include: {
      profile: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!user || user.verified) {
    return null;
  }

  const oldUserVerify = await db.userVerify.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!oldUserVerify) {
    return null;
  }

  const verifyCode = generateCode();

  const userVerify = await db.userVerify.update({
    where: {
      userId: user.id,
    },
    data: {
      code: passwordHelper.hash(verifyCode),
    },
  });

  await mailer.sendVerificationMail({
    to: user.profile!.email,
    code: verifyCode,
  });

  return userVerify;
};

export default {
  register,
  login,
  logout,
  checkSession,
  get,
  edit,
  changePassword,
  requestResetPassword,
  checkResetPasswordCode,
  resetPassword,
  verify,
  resendVerifyCode,
};

const generateCode = (codeLength: number = 6) => {
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    code += crypto.randomInt(36).toString(36);
  }

  return code.toUpperCase();
};
