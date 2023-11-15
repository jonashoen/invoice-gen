import { LoginRequest } from "@/interfaces/requests/user";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import createSession from "@/lib/createSession";
import { StatusCodes } from "http-status-codes";
import userSchemas from "@/schemas/user";
import withMiddleware from "@/middlewares/withMiddleware";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<LoginRequest> = async (req) => {
  const paylaod = req.data;

  const session = await user.login(paylaod);

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  if (!session.sessionId) {
    return apiError(StatusCodes.FORBIDDEN);
  }

  return createSession(session.sessionId);
};

const POST = withMiddleware([validateBody(userSchemas.login)], handler);

export { POST };
