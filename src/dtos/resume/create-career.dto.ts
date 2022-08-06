import { ICreateCareer } from "../../types";

export class CreateCareerDto implements ICreateCareer {
  company!: string | null;

  department!: string | null;

  position!: string | null;

  task!: string | null;

  joinedAt!: Date | null;

  quitedAt!: Date | null;

  isInOffice!: boolean | null;
}
