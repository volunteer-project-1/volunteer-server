/* eslint-disable @typescript-eslint/no-empty-interface */
// import { ICompany } from "../types";
// import { IUser } from "../types/user";
import { UserAndCompany } from "../types";

export {};

// export interface UserAndCompany extends IUser, ICompany {
//   type?: string;
// }
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo {}
    export interface User extends UserAndCompany {}

    namespace Multer {
      interface File extends Multer.File {
        bucket: string;
        key: string;
        acl: string;
        contentType: string;
        contentDisposition: null;
        storageClass: string;
        serverSideEncryption: null;
        metadata: any;
        location: string;
        etag: string;
      }
    }
  }
}
