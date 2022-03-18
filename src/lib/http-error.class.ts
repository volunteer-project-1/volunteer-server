/* eslint-disable max-classes-per-file */

import { HTTP_STATUS_CODE } from "../constants";

type ObjectType = Record<any, string> | undefined;

export class HttpError extends Error {
  status: number;

  objects: ObjectType[] | undefined;

  constructor(status: number, message?: string, objects?: ObjectType[]) {
    super(message);
    const { name, prototype } = new.target;

    Object.setPrototypeOf(this, prototype);
    this.name = name;
    this.status = status;
    this.objects = objects;
  }
}

export class BadReqError extends HttpError {
  constructor(message?: string, object?: ObjectType[]) {
    super(HTTP_STATUS_CODE.BAD_REQUEST, message, object);
    const { name, prototype } = new.target;

    Object.setPrototypeOf(this, prototype);
    this.name = name;
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: string, object?: ObjectType[]) {
    super(HTTP_STATUS_CODE.NOT_FOUND, message, object);
    const { name, prototype } = new.target;

    Object.setPrototypeOf(this, prototype);
    this.name = name;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string, object?: ObjectType[]) {
    super(HTTP_STATUS_CODE.UN_AUTHORIZE, message, object);
    const { name, prototype } = new.target;

    Object.setPrototypeOf(this, prototype);
    this.name = name;
  }
}
