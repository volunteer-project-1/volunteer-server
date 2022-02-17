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

resumeRouter
  .route("/:id")
  .get(asyncHandler(resumeController.findResumeById))
  .patch(asyncHandler(resumeController.updateResumeById))
  .delete(asyncHandler(resumeController.deleteResume));

resumeRouter
  .route("/:id/info")
  .patch(asyncHandler(resumeController.updateResumeInfo))
  .delete(asyncHandler(resumeController.deleteResumeInfo));

resumeRouter
  .route("/:id/education")
  .patch(asyncHandler(resumeController.updateEducation))
  .delete(asyncHandler(resumeController.deleteEducation));

resumeRouter
  .route("/:id/career")
  .patch(asyncHandler(resumeController.updateCareer))
  .delete(asyncHandler(resumeController.deleteCareer));

resumeRouter
  .route("/:id/activity")
  .patch(asyncHandler(resumeController.updateActivity))
  .delete(asyncHandler(resumeController.deleteActivity));

resumeRouter
  .route("/:id/award")
  .patch(asyncHandler(resumeController.updateAward))
  .delete(asyncHandler(resumeController.deleteAward));

resumeRouter
  .route("/:id/my-video")
  .patch(asyncHandler(resumeController.updateMyVideo))
  .delete(asyncHandler(resumeController.deleteMyVideo));

resumeRouter
  .route("/:id/helper-video")
  .patch(asyncHandler(resumeController.updateHelperVideo))
  .delete(asyncHandler(resumeController.deleteHelperVideo));

resumeRouter
  .route("/:id/preference")
  .patch(asyncHandler(resumeController.updatePreference))
  .delete(asyncHandler(resumeController.deletePreference));

resumeRouter
  .route("/:id/preference-job")
  .patch(asyncHandler(resumeController.updatePreferenceJob))
  .delete(asyncHandler(resumeController.deletePreferenceJob));

resumeRouter
  .route("/:id/preference-location")
  .patch(asyncHandler(resumeController.updatePreferenceLocation))
  .delete(asyncHandler(resumeController.deletePreferenceLocation));

export { resumeRouter };
