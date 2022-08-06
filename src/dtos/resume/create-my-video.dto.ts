import { ICreateMyVideo } from "../../types";

export class CreateMyVideoDto implements ICreateMyVideo {
  url!: string | null;
}
