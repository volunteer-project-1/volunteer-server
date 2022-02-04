import { Router } from "express";
import { Container } from "typedi";
import { IUserController } from "../../types/user";
import { UserController } from "../../controllers";
import { asyncHandler } from "../../utils";
import { authenticateUser } from "../../middlewares";

const userRouter = Router();

const userControllerInstance: IUserController = Container.get(UserController);

userRouter.route("").get(asyncHandler(userControllerInstance.findAll));
userRouter
  .route("/profile")
  .get(authenticateUser, asyncHandler(userControllerInstance.findMyProfile));
userRouter.route("/:id").get(asyncHandler(userControllerInstance.findById));

export { userRouter };
