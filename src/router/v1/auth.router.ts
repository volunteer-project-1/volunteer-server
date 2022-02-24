import { Router } from "express";
import passport from "passport";
import Container from "typedi";
import { UserController } from "../../controllers";
import { asyncHandler } from "../../utils";

const authRouter = Router();

const userController = Container.get(UserController);

authRouter
  .route("/local")
  .post(passport.authenticate("local"), function (_, res) {
    return res.status(200).json();
  });

authRouter
  .route("/local/signup")
  .post(asyncHandler(userController.localSignup));

authRouter
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `/login`,
    // failureRedirect: `${CLIENT_DOMAIN}/login`,
  }),
  (_, res) => {
    res.redirect("/");
    // res.redirect(CLIENT_DOMAIN);
  }
);

export { authRouter };
