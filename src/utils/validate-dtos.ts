import { validate } from "class-validator";
import { BadReqError } from "../lib";

export const validateDtos = async (...dtos: object[]) => {
  for (const dto of dtos) {
    if (!Object.keys(dto).length) {
      throw new BadReqError("There is no dto");
    }
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadReqError(
        undefined,
        errors.map((error) => error.constraints)
      );
    }
  }
};
