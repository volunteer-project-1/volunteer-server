import { DefaultTime } from ".";

export interface ICompanySecret {
  password?: string;
  salt?: string;
}

export interface IComapny extends DefaultTime, ICompanySecret {
  id: number;
  email: string;
}

export interface IComapnyDAO {
  findCompanyList: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<IComapny[] | undefined>;
}
