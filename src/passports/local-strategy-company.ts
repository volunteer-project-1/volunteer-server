import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Container from "typedi";
import { CompanyService } from "../services";
import { NotFoundError, UnauthorizedError } from "../lib";
import { verifyPassword } from "../utils";

export default () => {
  const companyService = Container.get(CompanyService);
  passport.use(
    "company",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, cb) => {
        const foundCompany = await companyService.findCompanyByEmail(email);

        if (!foundCompany || !foundCompany.password || !foundCompany.salt) {
          return cb(new NotFoundError("Not Found Email"));
        }

        const emailAndPasswordVerified = await verifyPassword(
          password,
          foundCompany.password,
          foundCompany.salt
        );

        if (!emailAndPasswordVerified) {
          return cb(new UnauthorizedError("Wrong Email Or Password"));
        }

        delete foundCompany.password;
        delete foundCompany.salt;
        
        return cb(null, { ...foundCompany });
      }
    )
  );
};
