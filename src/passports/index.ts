import passport from "passport";
import { IUser } from "../types/user";
import google from "./google-strategy";
import local from "./local-strategy";

export default () => {
  passport.serializeUser((user: IUser, done) => {
    return done(null, user);
  });
  passport.deserializeUser(async (user: IUser, done) => {
    try {
      return done(null, user); // req.user
    } catch (error) {
      // TODO 나중에 로거로 바꾸기
      //   console.error(error)
      return done(error);
    }
  });

  local();
  google();
};
