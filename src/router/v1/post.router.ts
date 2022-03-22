import { Router } from "express";
import Container from "typedi";
import { PostController } from "../../controllers";
import { asyncHandler } from "../../utils";
import { authenticateUser } from "../../middlewares";

const postRouter = Router();

const postController = Container.get(PostController);

postRouter.route("/")
    .get(asyncHandler(postController.find))
    .post(authenticateUser, asyncHandler(postController.createPost));

postRouter.route("/:id")
    .patch(authenticateUser, asyncHandler(postController.updatePostById));

export { postRouter };
