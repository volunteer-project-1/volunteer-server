import { ICreateHelperVideo } from "../../types";

export class CreateHelperVideoDto implements ICreateHelperVideo {
  url!: string | null;
}
