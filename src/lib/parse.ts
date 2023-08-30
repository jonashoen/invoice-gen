import BaseRequest from "@/interfaces/requests/BaseRequest";
import { ObjectSchema } from "joi";

const parse = async <T>(schema: ObjectSchema, request: BaseRequest<T>) => {
  const body = await request.json();

  const validationResult = schema.validate(body);

  if (validationResult.error) {
    return null;
  }

  return validationResult.value as T;
};

export default parse;
