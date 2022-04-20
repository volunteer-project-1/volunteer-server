import { NextFunction, Request, Response } from "express";
import { AUTH_TYPE } from "../constants";
import { UnauthorizedError } from "../lib";

export const isAuthenticate = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    if (req.user.type) {
      throw new UnauthorizedError("유저 계정만 접근 가능");
    }
    next();
  } else {
    throw new UnauthorizedError("로그인 필요");
    // res.status(301).redirect(`${URL}/login`)
  }
};

export const isCompanyAuthenticate = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated() && req.user.type === AUTH_TYPE) {
    next();
  } else {
    throw new UnauthorizedError("회사 계정만 접근 가능");
    // res.status(301).redirect(`${URL}/login`)
  }
};

export const isUnAuthenticate = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.isUnauthenticated()) {
    next();
  } else {
    throw new UnauthorizedError("로그인 한 유저는 접근 불가");
    // res.status(301).redirect(`${URL}/login`)
  }
};
