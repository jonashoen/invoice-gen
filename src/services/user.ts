import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import db from "@/db";
import sessionConfig from "@/config/session";
import passwordHelper from "@/lib/password";

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
  passwordRepeated: string;
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

  const oldUser = await db.user.findUnique({ where: { username } });

  if (oldUser) {
    return null;
  }

  const user = await db.user.create({
    data: {
      username,
      password: passwordHelper.hash(password),
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
  });

  return await createSession(user.id);
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

  return await createSession(user.id);
};

const createSession = async (userId: number) => {
  return await db.session.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      sessionId: crypto.randomUUID(),
      expires: dayjs.utc().add(sessionConfig.maxAge, "milliseconds").toDate(),
    },
    update: {
      sessionId: crypto.randomUUID(),
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

  return await db.user.update({
    where: {
      id,
    },
    data: {
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
    },
  });
};

const changePassword = async (
  id: number,
  {
    oldPassword,
    newPassword,
    newPasswordRepeated,
  }: { oldPassword: string; newPassword: string; newPasswordRepeated: string }
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

export default { register, login, checkSession, get, edit, changePassword };
