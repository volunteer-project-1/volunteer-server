import multer, { Options, FileFilterCallback } from "multer";
import multerS3, { AUTO_CONTENT_TYPE } from "multer-s3";
import path from "path";
import Container from "typedi";
import { BadReqError, MulterS3 } from "../lib";
import { S3_BUCKET } from "../config";

const MAX_SIZE = 60 * 1024 * 1024; // 60MB

const s3 = Container.get(MulterS3).getS3();

const checkFileCheck = (
  file: Express.Multer.File,
  type: string,
  cb: FileFilterCallback
) => {
  // Allowed ext
  const filetypes =
    type === "video" ? /mp4|avi|wmv|m4a/ : type === "pdf" ? /pdf|hwp/ : /etc/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new BadReqError("Videos Only!"));
  }
};

const MULTER_OPTION = (type: string): Options => {
  return {
    storage: multerS3({
      s3,
      bucket: S3_BUCKET,
      acl: "public-read",
      contentType: AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.originalname.split(".").pop()}`);
      },
    }),
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
      checkFileCheck(file, type, cb);
    },
  };
};

const FILE_TYPE = ["video", "pdf"] as const;

type FileType = typeof FILE_TYPE[number];

export const upload = (type: FileType) => multer(MULTER_OPTION(type));
// export const upload = multer(MULTER_OPTION);
