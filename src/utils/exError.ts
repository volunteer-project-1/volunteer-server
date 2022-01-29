/* eslint-disable max-classes-per-file */
export class ExError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }
}

export class BadReqError extends ExError {
  constructor() {
    super(401, "BadRequestError");
    const { name, prototype } = new.target;

    Object.setPrototypeOf(this, prototype);
    this.name = name;
  }
}

export class NotFoundError extends ExError {
  constructor() {
    super(404, "NotFoundError");
    const { name, prototype } = new.target;

    Object.setPrototypeOf(this, prototype);
    this.name = name;
  }
}

export default ExError;
