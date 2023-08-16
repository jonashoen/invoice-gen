import bcrypt from "bcrypt";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import db from "@/db";
import sessionConfig from "@/config/session";

dayjs.extend(utc);

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

  const passwordCorrect = bcrypt.compareSync(password, user.password);

  if (!passwordCorrect) {
    return null;
  }

  return await createSession(user.id);
};

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
  zipCode: number;
  city: string;
  street: string;
  houseNumber: number;
  bank: string;
  iban: string;
  bic: string;
  taxNumber: string;
  vatId: string;
  telephone: string;
  email: string;
}) => {
  const oldUser = await db.user.findUnique({ where: { username } });

  if (oldUser) {
    return null;
  }

  if (password !== passwordRepeated) {
    return null;
  }

  if (!Number.isInteger(zipCode) || !Number.isInteger(houseNumber)) {
    return null;
  }

  const user = await db.user.create({
    data: {
      username,
      password: bcrypt.hashSync(password, 14),
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

export default { login, register };
