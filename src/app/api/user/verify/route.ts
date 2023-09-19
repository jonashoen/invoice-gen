import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import { VerifyAccountRequest } from "@/interfaces/requests/user";
import createSession from "@/lib/createSession";
import userSchemas from "@/schemas/user";
import withMiddleware from "@/middlewares/withMiddleware";
import unauthenticate from "@/middlewares/unauthenticate";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<VerifyAccountRequest> = async (req) => {
  const payload = req.data;

  const session = await user.verify(payload);

  if (!session) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return createSession(session.sessionId);
};

const POST = withMiddleware(
  [unauthenticate, validateBody(userSchemas.verifyAccount)],
  handler
);

export { POST };
