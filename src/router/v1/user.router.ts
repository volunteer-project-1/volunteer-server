import { Router } from "express";
import { Container } from "typedi";
import { IUserController } from "../../types/user";
import { UserController } from "../../controllers";
import { asyncHandler } from "../../utils";

const userRouter = Router();

const userControllerInstance: IUserController = Container.get(UserController);

// userRouter.route("/").post(asyncHandler(userControllerInstance.create));

// userRouter.route("").get(wrap(userControllerInstance.findAlasyncHandlerl));
userRouter.route("").get(asyncHandler(userControllerInstance.findAll));
userRouter.route("/:id").get(asyncHandler(userControllerInstance.findById));

export { userRouter };
