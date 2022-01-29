import { Service } from "typedi";
import { Request, Response } from "express";
import { IUserController } from "../types/user";
import { UserService } from "../services";

@Service()
class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  // APIDOCS 작성 여기에.
  findById = async ({ params: { id } }: Request, res: Response) => {
    const filter = {
      _id: id,
    };
    const select = "email createdAt";

    const result = await this.userService.findOne(filter, select);

    return res.json({ user: result }).status(200);
  };

  create = async (req: Request, res: Response) => {
    const data = { ...req.body };

    const result = await this.userService.create(data);

    return res.json({ user: result }).status(201);
  };
}

export default UserController;
