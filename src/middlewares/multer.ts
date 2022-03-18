import multer, { Options, FileFilterCallback } from "multer";
import multerS3, { AUTO_CONTENT_TYPE } from "multer-s3";
import path from "path";
import Container from "typedi";
import { BadReqError, MulterS3 } from "../lib";
import { S3_BUCKET } from "../config";

const MAX_SIZE = 60 * 1024 * 1024; // 60MB

const s3 = Container.get(MulterS3).getS3();

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
  // Allowed ext
  const filetypes = /mp4|avi|wmv|m4a/;
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

const MULTER_OPTION: Options = {
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
    checkFileType(file, cb);
  },
};

export const upload = multer(MULTER_OPTION);
