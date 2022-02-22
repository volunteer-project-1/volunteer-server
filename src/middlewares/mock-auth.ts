import { NextFunction, Request, Response } from "express";

export const mockAuthenticateUser = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const user = { id: 1, email: "ehgks0083@gmail.com" };
  req.user = user;
  next();
};
