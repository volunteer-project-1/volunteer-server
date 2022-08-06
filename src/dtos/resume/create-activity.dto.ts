import { ICreateActivity } from "../../types";

export class CreateActivityDto implements ICreateActivity {
  organization!: string | null;

  description!: string | null;
}
