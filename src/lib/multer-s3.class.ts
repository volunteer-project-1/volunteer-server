import { config, S3 } from "aws-sdk";
import path from "path";
import { Service } from "typedi";
import { S3_BUCKET } from "../config";

@Service()
export class MulterS3 {
  private s3;

  constructor() {
    config.loadFromPath(path.join(__dirname, "../../awsconfig.json"));
    this.s3 = new S3();
  }

  getS3() {
    return this.s3;
  }

  getSignedUrl(key: string) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: S3_BUCKET,
      Key: key,
      // 기본 15분에서 최대 12시간만 가능. 초단위
      // Expires: 60 * 60 * 60 * 24 * 365, // 1,892,160,000
    });
  }
}
