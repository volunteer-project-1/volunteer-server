import { NextFunction, Request, RequestHandler, Response } from "express";

/* eslint-disable */
export const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// export default asyncHandler;

export function wrap(handler: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
      //   await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
