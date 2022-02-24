import { validate } from "class-validator";
import { BadReqError } from ".";

export const validateDto = async (dto: object) => {
  const error = await validate(dto);
  if (error.length > 0) {
    throw new BadReqError(JSON.stringify(error));
  }
};
