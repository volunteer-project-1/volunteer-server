import multer, { Options, FileFilterCallback } from "multer";
import multerS3, { AUTO_CONTENT_TYPE } from "multer-s3";
import path from "path";
import Container from "typedi";
import { BadReqError, MulterS3 } from "../lib";
import { S3_BUCKET } from "../config";

const MAX_SIZE = 60 * 1024 * 1024; // 60MB

const s3 = Container.get(MulterS3).getS3();

function checkFileType(type: string) {
  if (type === "video") {
    return /mp4|avi|wmv|m4a/;
  }
  if (type === "pdf") {
    return /pdf|hwp/;
  }
  if (type === "avatar") {
    return /jpg/;
  }

  return /etc/;
}

const checkFileCheck = (
  file: Express.Multer.File,
  type: string,
  cb: FileFilterCallback
) => {
  // Allowed ext
  const filetypes = checkFileType(type);

  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new BadReqError("Check Your File Type"));
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
    checkFileCheck(file, req.url.split("/")[1], cb);
  },
};

export const upload = multer(MULTER_OPTION);
