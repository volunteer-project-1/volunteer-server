/* eslint-disable max-classes-per-file */
export class ExError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message);
    this.status = status;
  }
}

export class BadReqError extends ExError {
  constructor(message?: string) {
    super(401, message);
    const { name, prototype } = new.target;

    Object.setPrototypeOf(this, prototype);
    this.name = name;
  }
}

export class NotFoundError extends ExError {
  constructor(message?: string) {
    super(404, message);
    const { name, prototype } = new.target;

    Object.setPrototypeOf(this, prototype);
    this.name = name;
  }
}

export default ExError;
