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
  .get(authenticateUser, asyncHandler(resumeController.findResumeById))
  .patch(authenticateUser, asyncHandler(resumeController.updateResumeById))
  .delete(authenticateUser, asyncHandler(resumeController.deleteResume));

resumeRouter
  .route("/:id/info")
  .patch(authenticateUser, asyncHandler(resumeController.updateResumeInfo))
  .delete(authenticateUser, asyncHandler(resumeController.deleteResumeInfo));

resumeRouter
  .route("/:id/education")
  .patch(authenticateUser, asyncHandler(resumeController.updateEducation))
  .delete(authenticateUser, asyncHandler(resumeController.deleteEducation));

resumeRouter
  .route("/:id/career")
  .patch(authenticateUser, asyncHandler(resumeController.updateCareer))
  .delete(authenticateUser, asyncHandler(resumeController.deleteCareer));

resumeRouter
  .route("/:id/activity")
  .patch(authenticateUser, asyncHandler(resumeController.updateActivity))
  .delete(authenticateUser, asyncHandler(resumeController.deleteActivity));

resumeRouter
  .route("/:id/award")
  .patch(authenticateUser, asyncHandler(resumeController.updateAward))
  .delete(authenticateUser, asyncHandler(resumeController.deleteAward));

resumeRouter
  .route("/:id/my-video")
  .patch(authenticateUser, asyncHandler(resumeController.updateMyVideo))
  .delete(authenticateUser, asyncHandler(resumeController.deleteMyVideo));

resumeRouter
  .route("/:id/helper-video")
  .patch(authenticateUser, asyncHandler(resumeController.updateHelperVideo))
  .delete(authenticateUser, asyncHandler(resumeController.deleteHelperVideo));

resumeRouter
  .route("/:id/preference")
  .patch(authenticateUser, asyncHandler(resumeController.updatePreference))
  .delete(authenticateUser, asyncHandler(resumeController.deletePreference));

resumeRouter
  .route("/:id/preference-job")
  .patch(authenticateUser, asyncHandler(resumeController.updatePreferenceJob))
  .delete(authenticateUser, asyncHandler(resumeController.deletePreferenceJob));

resumeRouter
  .route("/:id/preference-location")
  .patch(
    authenticateUser,
    asyncHandler(resumeController.updatePreferenceLocation)
  )
  .delete(
    authenticateUser,
    asyncHandler(resumeController.deletePreferenceLocation)
  );

export { resumeRouter };
