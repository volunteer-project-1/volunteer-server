import { Router } from "express";
import Container from "typedi";
import { ResumeController } from "../../controllers";
import { authenticateUser } from "../../middlewares";
import { asyncHandler } from "../../utils";

const resumeRouter = Router();

const resumeController = Container.get(ResumeController);

resumeRouter
  .route("")
  .post(authenticateUser, asyncHandler(resumeController.createResume));

resumeRouter.route("/:id").get(asyncHandler(resumeController.findResumeById));

export { resumeRouter };
