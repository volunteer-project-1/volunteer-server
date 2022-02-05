import { NextFunction, Request, Response } from "express";
// RequestHandler

/* eslint-disable */
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// export function wrap(handler: RequestHandler) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await handler(req, res, next);
//       //   await handler(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// }
