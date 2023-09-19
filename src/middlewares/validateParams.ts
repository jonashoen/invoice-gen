import { ObjectSchema } from "joi";
import { Middleware } from "./withMiddleware";
import validate from "@/lib/validate";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";

const validateParams = <T>(schema: ObjectSchema): Middleware<unknown, any> => {
  return async (req, next) => {
    try {
      const params = req.params;

      const payload = validate<T>(schema, params);

      if (!payload) {
        return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
      }

      req.params = payload;

      return next();
    } catch {
      return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
    }
  };
};

export default validateParams;
