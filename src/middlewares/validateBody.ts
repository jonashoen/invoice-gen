import { ObjectSchema } from "joi";
import { Middleware } from "./withMiddleware";
import validate from "@/lib/validate";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";

const validateBody = <T>(schema: ObjectSchema): Middleware<T, unknown> => {
  return async (req, next) => {
    try {
      const body = await req.json();

      const payload = validate<T>(schema, body);

      if (!payload) {
        return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
      }

      req.data = payload;

      return next();
    } catch {
      return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
    }
  };
};

export default validateBody;
