import { Service } from "typedi";
import { IUserController } from "../types/user";
import { UserService } from "../services";
import { Request, Response } from "express";

@Service()
class UserController implements IUserController {
  constructor(private userService: UserService) {}

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
