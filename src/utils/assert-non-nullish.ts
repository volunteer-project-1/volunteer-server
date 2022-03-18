import { NotFoundError } from "../lib";

export function assertNonNullish<TValue>(
  value: TValue,
  message?: string
): asserts value is NonNullable<TValue> {
  if (!value || value === null || value === undefined) {
    throw new NotFoundError(message);
  }
}
