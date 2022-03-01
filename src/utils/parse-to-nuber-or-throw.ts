import { BadReqError } from ".";

export function parseToNumberOrThrow(
  value: string | number,
  message?: string
): number {
  const parsedInt = Number(value);
  if (!parsedInt) {
    throw new BadReqError(message);
  }
  return parsedInt;
}
