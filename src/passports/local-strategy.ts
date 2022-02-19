import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Container from "typedi";
import { UserService } from "../services";
import { NotFoundError } from "../utils";

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

        // verifyUser

        if (!foundUser) {
          return cb(new NotFoundError("Not Found Email"));
        }

        return cb(null, foundUser);
      }
    )
  );
};
