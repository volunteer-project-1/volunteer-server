import { registerDecorator, ValidationOptions } from "class-validator";

export function IsNotBlank(
  property: string,
  validationOptions?: ValidationOptions
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    const isSpaceRegex = /\s/;
    registerDecorator({
      name: "isNotBlank",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === "string" && !value.match(isSpaceRegex);
        },
        defaultMessage() {
          return `Remove the space from the string.`;
        },
      },
    });
  };
}
