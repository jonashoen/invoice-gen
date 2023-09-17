import { ObjectSchema } from "joi";

const validate = <T>(schema: ObjectSchema, obj: any) => {
  const validationResult = schema.validate(obj);

  if (validationResult.error) {
    return null;
  }

  return validationResult.value as T;
};

export default validate;
