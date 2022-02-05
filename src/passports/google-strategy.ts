import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Container from "typedi";
import { GOOGLE_CONFIG } from "../config";
import { UserService } from "../services";
import { NotFoundError } from "../utils";

export default () => {
  const userService = Container.get(UserService);
  passport.use(
    new GoogleStrategy(
      {
        // TODO 나중에 구글 클라우드 플랫폼에서 변경해주기
        ...GOOGLE_CONFIG,
      },
      async (_accessToken, _refreshToken, profile, cb) => {
        // eslint-disable-next-line no-underscore-dangle
        const { email } = profile._json;
        if (!email) {
          return cb(new NotFoundError("Not Found Email"));
        }
        const user = await userService.findUserByEmail(email);

        if (!user) {
          await userService.createUser(email);
          const createdUser = await userService.findUserByEmail(email);

          return cb(null, createdUser);
        }

        return cb(null, user);
      }
    )
  );
};
