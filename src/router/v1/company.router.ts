import { Router } from "express";
import Container from "typedi";
import { CompanyController } from "../../controllers";
import { asyncHandler } from "../../utils";

const companyRouter = Router();

const companyController = Container.get(CompanyController);

companyRouter.route("").get(asyncHandler(companyController.findCompanyList));
companyRouter
  .route("/:id/info")
  .post(asyncHandler(companyController.createCompanyInfo));

companyRouter
  .route("/:id/history")
  .post(asyncHandler(companyController.createCompanyHistory));
//   .post(asyncHandler(companyController.createCompany));

export { companyRouter };
