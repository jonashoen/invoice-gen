import { NextRequest } from "next/server";
import { ObjectSchema } from "joi";

class BaseRequest<T = unknown> extends NextRequest {
  async parse(schema: ObjectSchema) {
    const body = await super.json();

    const validationResult = schema.validate(body);

    if (validationResult.error) {
      return null;
    }

    return validationResult.value as T;
  }
}

export default BaseRequest;
