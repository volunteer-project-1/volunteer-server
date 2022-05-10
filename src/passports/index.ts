import passport from "passport";
import { UserAndCompany } from "../types";
import google from "./google-strategy";
import local from "./local-strategy";
import localCompany from "./local-strategy-company";

// export interface UserAndCompany extends IUser, ICompany {
//   type?: string;
// }
export default () => {
  passport.serializeUser((user: UserAndCompany, done) => {
    // console.log("시리얼라이즈", user);
    if (user.name) {
      return done(null, { ...user, type: "company" });
    } else {
      return done(null, { ...user, type: "user" });
    }
  });
  passport.deserializeUser(async (user: UserAndCompany, done) => {
    // console.log("디시리얼라이즈", user);
    try {
      return done(null, user); // req.user
    } catch (error) {
      // TODO 나중에 로거로 바꾸기
      //   console.error(error)
      return done(error);
    }
  });

  local();
  localCompany();
  google();
};
