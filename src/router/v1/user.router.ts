import { Router } from "express";
import { Container } from "typedi";
import { UserController } from "../../controllers";
import { asyncHandler } from "../../utils";
import { isAuthenticate } from "../../middlewares";

const userRouter = Router();

const userController = Container.get(UserController);

userRouter.route("").get(asyncHandler(userController.findUsers));

userRouter
  .route("/profile")
  .get(isAuthenticate, asyncHandler(userController.findMyProfile))
  .patch(isAuthenticate, asyncHandler(userController.updateMyProfile));

userRouter.route("/:id").get(asyncHandler(userController.findUserById));

export { userRouter };
