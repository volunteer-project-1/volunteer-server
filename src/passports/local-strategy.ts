import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Container from "typedi";
import { CompanyService, UserService } from "../services";
import { NotFoundError, UnauthorizedError } from "../lib";
import { verifyPassword } from "../utils";
import { AUTH_TYPE } from "../constants";

export default () => {
  const userService = Container.get(UserService);
  const companyService = Container.get(CompanyService);
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, cb) => {
        const foundUser = await userService.findUserByEmail(email);

        if (!foundUser || !foundUser.password || !foundUser.salt) {
          return cb(new NotFoundError("Not Found Email"));
        }

        const emailAndPasswordVerified = await verifyPassword(
          password,
          foundUser.password,
          foundUser.salt
        );

        if (!emailAndPasswordVerified) {
          return cb(new UnauthorizedError("Wrong Email Or Password"));
        }

        const info = await companyService.findCompanyInfo(foundUser.id);

        return cb(null, { ...foundUser, ...(info && { type: AUTH_TYPE }) });
      }
    )
  );
};
