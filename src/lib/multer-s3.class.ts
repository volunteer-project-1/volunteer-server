import { config, S3 } from "aws-sdk";
import path from "path";
import { Service } from "typedi";
import { S3_BUCKET } from "../config";

@Service()
export class MulterS3 {
  private s3;

  constructor() {
    config.loadFromPath(path.join(__dirname, "../../awsconfig.storj.json"));
    this.s3 = new S3();
  }

  getS3() {
    return this.s3;
  }

  getSignedUrl(key: string) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: S3_BUCKET,
      Key: key,
    });
  }
}
