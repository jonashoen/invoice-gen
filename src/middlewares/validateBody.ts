import { ObjectSchema } from "joi";
import { Middleware } from "./withMiddleware";
import parse from "@/lib/parse";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";

const validateBody = <T>(schema: ObjectSchema): Middleware<T> => {
  return async (req, next) => {
    const body = await parse(schema, req);

    if (!body) {
      return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
    }

    req.data = body;

    return next();
  };
};

export default validateBody;
