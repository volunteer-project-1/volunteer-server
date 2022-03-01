import { validate } from "class-validator";
import { BadReqError } from ".";

export const validateDtos = async (...dtos: object[]) => {
  for (const dto of dtos) {
    const error = await validate(dto);
    if (error.length > 0) {
      throw new BadReqError(JSON.stringify(error));
    }
  }
};
