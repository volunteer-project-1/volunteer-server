import { ICreateAward } from "../../types";

export class CreateAwardDto implements ICreateAward {
  name!: string | null;

  institute!: string | null;

  startedAt!: Date | null;

  finishedAt!: Date | null;
}
