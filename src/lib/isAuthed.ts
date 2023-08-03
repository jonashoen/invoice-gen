import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "token";

const isAuthed = () => {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);

  if (!token) {
    return false;
  }

  return true;
};

export default isAuthed;
