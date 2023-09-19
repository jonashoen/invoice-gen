import { ObjectSchema } from "joi";

const validate = <T>(schema: ObjectSchema<T>, obj: any) => {
  const validationResult = schema.validate(obj);

  if (validationResult.error) {
    return null;
  }

  return validationResult.value;
};

export default validate;
