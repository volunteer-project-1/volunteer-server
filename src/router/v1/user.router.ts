import { Router } from "express";
import { Container } from "typedi";
import { UserController } from "../../controllers";
import { asyncHandler } from "../../utils";
import { isUserAuthenticate } from "../../middlewares";

const userRouter = Router();

const userController = Container.get(UserController);

userRouter.route("").get(asyncHandler(userController.findUsers));

userRouter
  .route("/profile")
  .get(isUserAuthenticate, asyncHandler(userController.findMyProfile))
  .patch(isUserAuthenticate, asyncHandler(userController.updateMyProfile));

userRouter.route("/:id").get(asyncHandler(userController.findUserById));

export { userRouter };
