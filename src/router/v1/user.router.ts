import express from "express";
import { Container } from "typedi";
import { IUserController } from "../../types/user";
import { UserController } from "../../controllers";
import { asyncHandler } from "../../utils";

const router = express.Router();

const userControllerInstance: IUserController = Container.get(UserController);

// router.route("/").post(asyncHandler(userControllerInstance.create));

// router.route("").get(wrap(userControllerInstance.findAlasyncHandlerl));
router.route("").get(asyncHandler(userControllerInstance.findAll));
router.route("/:id").get(asyncHandler(userControllerInstance.findById));

export default router;
