import { ICreatePreferenceJob } from "../../types";

export class CreatePreferenceJobDto implements ICreatePreferenceJob {
  name!: string | null;
}
