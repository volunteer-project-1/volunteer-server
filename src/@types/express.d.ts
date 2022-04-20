/* eslint-disable @typescript-eslint/no-empty-interface */
import { IUser } from "../types/user";

export {};

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo {}
    export interface User extends IUser {
      // TODO 유저와 컴퍼니를 USER 테이블에서 같이 사용 중
      type?: string;
    }

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
