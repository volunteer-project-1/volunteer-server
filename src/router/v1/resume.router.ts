import { Router } from "express";
import Container from "typedi";
import { ResumeController } from "../../controllers";
import { isAuthenticate, upload } from "../../middlewares";
import { asyncHandler } from "../../utils";

const resumeRouter = Router();

const resumeController = Container.get(ResumeController);

resumeRouter
  .route("/video")
  .post(
    isAuthenticate,
    upload("video").single("url"),
    asyncHandler(resumeController.upload)
  );

resumeRouter
  .route("/pdf")
  .post(
    isAuthenticate,
    upload("pdf").single("url"),
    asyncHandler(resumeController.upload)
  );

resumeRouter
  .route("")
  .get(isAuthenticate, asyncHandler(resumeController.findMyResumes))
  .post(isAuthenticate, asyncHandler(resumeController.createResume));

resumeRouter
  .route("/public")
  .get(asyncHandler(resumeController.findPublicResumes));

resumeRouter
  .route("/:id")
  .get(isAuthenticate, asyncHandler(resumeController.findResumeById))
  .patch(isAuthenticate, asyncHandler(resumeController.updateResumeById))
  .delete(isAuthenticate, asyncHandler(resumeController.deleteResume));

resumeRouter
  .route("/:id/info")
  .patch(isAuthenticate, asyncHandler(resumeController.updateResumeInfo))
  .delete(isAuthenticate, asyncHandler(resumeController.deleteResumeInfo));

resumeRouter
  .route("/:id/education")
  .patch(isAuthenticate, asyncHandler(resumeController.updateEducation))
  .delete(isAuthenticate, asyncHandler(resumeController.deleteEducation));

resumeRouter
  .route("/:id/career")
  .patch(isAuthenticate, asyncHandler(resumeController.updateCareer))
  .delete(isAuthenticate, asyncHandler(resumeController.deleteCareer));

resumeRouter
  .route("/:id/activity")
  .patch(isAuthenticate, asyncHandler(resumeController.updateActivity))
  .delete(isAuthenticate, asyncHandler(resumeController.deleteActivity));

resumeRouter
  .route("/:id/award")
  .patch(isAuthenticate, asyncHandler(resumeController.updateAward))
  .delete(isAuthenticate, asyncHandler(resumeController.deleteAward));

resumeRouter
  .route("/:id/my-video")
  .patch(isAuthenticate, asyncHandler(resumeController.updateMyVideo))
  .delete(isAuthenticate, asyncHandler(resumeController.deleteMyVideo));

resumeRouter
  .route("/:id/helper-video")
  .patch(isAuthenticate, asyncHandler(resumeController.updateHelperVideo))
  .delete(isAuthenticate, asyncHandler(resumeController.deleteHelperVideo));

resumeRouter
  .route("/:id/preference")
  .patch(isAuthenticate, asyncHandler(resumeController.updatePreference))
  .delete(isAuthenticate, asyncHandler(resumeController.deletePreference));

resumeRouter
  .route("/:id/preference-job")
  .patch(isAuthenticate, asyncHandler(resumeController.updatePreferenceJob))
  .delete(isAuthenticate, asyncHandler(resumeController.deletePreferenceJob));

resumeRouter
  .route("/:id/preference-location")
  .patch(
    isAuthenticate,
    asyncHandler(resumeController.updatePreferenceLocation)
  )
  .delete(
    isAuthenticate,
    asyncHandler(resumeController.deletePreferenceLocation)
  );

export { resumeRouter };
