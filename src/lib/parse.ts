import BaseRequest from "@/interfaces/requests/BaseRequest";
import { ObjectSchema } from "joi";

const parse = async <T>(schema: ObjectSchema, request: BaseRequest<T>) => {
  try {
    const body = await request.json();

    const validationResult = await schema.validateAsync(body);

    return validationResult as T;
  } catch {
    return null;
  }
};

export default parse;
