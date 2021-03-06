import { Router } from "express";
import Container from "typedi";
import { ResumeController } from "../../controllers";
import { isUserAuthenticate, upload } from "../../middlewares";
import { asyncHandler } from "../../utils";

const resumeRouter = Router();

const resumeController = Container.get(ResumeController);

resumeRouter
  .route("/video")
  .post(
    isUserAuthenticate,
    upload.single("url"),
    asyncHandler(resumeController.upload)
  );

resumeRouter
  .route("/pdf")
  .post(
    isUserAuthenticate,
    upload.single("url"),
    asyncHandler(resumeController.upload)
  );

resumeRouter
  .route("/avatar")
  .post(
    isUserAuthenticate,
    upload.single("url"),
    asyncHandler(resumeController.upload)
  );

resumeRouter
  .route("")
  .get(isUserAuthenticate, asyncHandler(resumeController.findMyResumes))
  .post(isUserAuthenticate, asyncHandler(resumeController.createResume));

resumeRouter
  .route("/public")
  .get(asyncHandler(resumeController.findPublicResumes));

resumeRouter
  .route("/:id")
  .get(isUserAuthenticate, asyncHandler(resumeController.findResumeById))
  .patch(isUserAuthenticate, asyncHandler(resumeController.updateResumeById))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deleteResume));

resumeRouter
  .route("/:id/info")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updateResumeInfo))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deleteResumeInfo));

resumeRouter
  .route("/:id/education")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updateEducation))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deleteEducation));

resumeRouter
  .route("/:id/career")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updateCareer))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deleteCareer));

resumeRouter
  .route("/:id/activity")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updateActivity))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deleteActivity));

resumeRouter
  .route("/:id/award")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updateAward))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deleteAward));

resumeRouter
  .route("/:id/my-video")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updateMyVideo))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deleteMyVideo));

resumeRouter
  .route("/:id/helper-video")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updateHelperVideo))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deleteHelperVideo));

resumeRouter
  .route("/:id/preference")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updatePreference))
  .delete(isUserAuthenticate, asyncHandler(resumeController.deletePreference));

resumeRouter
  .route("/:id/preference-job")
  .patch(isUserAuthenticate, asyncHandler(resumeController.updatePreferenceJob))
  .delete(
    isUserAuthenticate,
    asyncHandler(resumeController.deletePreferenceJob)
  );

resumeRouter
  .route("/:id/preference-location")
  .patch(
    isUserAuthenticate,
    asyncHandler(resumeController.updatePreferenceLocation)
  )
  .delete(
    isUserAuthenticate,
    asyncHandler(resumeController.deletePreferenceLocation)
  );

export { resumeRouter };
