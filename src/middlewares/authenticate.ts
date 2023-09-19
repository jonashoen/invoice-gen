import apiError from "@/lib/apiError";
import { Middleware } from "./withMiddleware";
import isAuthed from "@/lib/isAuthed";
import { StatusCodes } from "http-status-codes";
import Authed from "@/interfaces/requests/AuthedRequest";

const authenticate: Middleware<unknown, unknown> = async (req, next) => {
  const userId = await isAuthed();

  if (!userId) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  (req as Authed<typeof req>).user = userId;

  return next();
};

export default authenticate;
