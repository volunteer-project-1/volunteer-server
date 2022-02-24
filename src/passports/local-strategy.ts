import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Container from "typedi";
import { UserService } from "../services";
import { NotFoundError, UnauthorizedError, verifyPassword } from "../utils";

export default () => {
  const userService = Container.get(UserService);
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, cb) => {
        const foundUser = await userService.findUserByEmail(email);

        if (!foundUser) {
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

        return cb(null, foundUser);
      }
    )
  );
};
