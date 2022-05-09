import { Router } from "express";
import passport from "passport";
import Container from "typedi";
import { CompanyController, UserController } from "../../controllers";
import { BadReqError } from "../../lib";
import { asyncHandler } from "../../utils";

const authRouter = Router();

const userController = Container.get(UserController);
const companyController = Container.get(CompanyController);

authRouter.route("/local").post(passport.authenticate("user"), (_, res) => {
  return res.status(200).send("Logged in.");
});

authRouter
  .route("/local/company")
  .post(passport.authenticate("company"), (_, res) => {
    return res.status(200).send("Logged in.");
  });

authRouter
  .route("/local/signup/user")
  .post(asyncHandler(userController.createUserByLocal));

authRouter
  .route("/local/signup/company")
  .post(asyncHandler(companyController.createCompany));

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

authRouter.route("/logout").get(async (req, res) => {
  await req.session.destroy((err) => {
    if (err) {
      throw new BadReqError();
    }
  });

  req.logOut();

  res.redirect("/");
});

export { authRouter };
