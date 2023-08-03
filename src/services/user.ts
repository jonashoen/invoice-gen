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

export default { login };
