import { Router } from "express";
import Container from "typedi";
import { CompanyController } from "../../controllers";
import { isUserAuthenticate, isCompanyAuthenticate } from "../../middlewares";
import { asyncHandler } from "../../utils";

const companyRouter = Router();

const companyController = Container.get(CompanyController);

companyRouter
  .route("")
  .get(asyncHandler(companyController.findCompanyList))
  .patch(isCompanyAuthenticate, asyncHandler(companyController.updateCompany));

companyRouter
  .route("/my")
  .get(isCompanyAuthenticate, asyncHandler(companyController.myCompanyProfile));

companyRouter
  .route("/:id/history")
  .post(
    isCompanyAuthenticate,
    asyncHandler(companyController.createCompanyHistory)
  )
  .patch(
    isCompanyAuthenticate,
    asyncHandler(companyController.updateCompanyHistory)
  );
//   .post(asyncHandler(companyController.createCompany));

companyRouter
  .route("/:id/job-description")
  .post(
    isCompanyAuthenticate,
    asyncHandler(companyController.createJobDescription)
  );

companyRouter
  .route("/applying")
  .post(
    isUserAuthenticate,
    asyncHandler(companyController.createResumeApplying)
  )
  .get(
    isUserAuthenticate,
    asyncHandler(companyController.findResumeApplyingByUserId)
  );

export { companyRouter };
