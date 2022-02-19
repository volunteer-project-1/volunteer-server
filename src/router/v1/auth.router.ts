import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter
  .route("/local")
  .post(passport.authenticate("local", { failureRedirect: "/login" }));

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
