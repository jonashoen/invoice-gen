import apiError from "@/lib/apiError";
import { Middleware } from "./withMiddleware";
import isAuthed from "@/lib/isAuthed";
import { StatusCodes } from "http-status-codes";

const authenticate: Middleware<unknown> = async (req, next) => {
  const userId = await isAuthed();

  if (!userId) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  req.user = userId;

  return next();
};

export default authenticate;
