import * as crypto from "crypto";
import { logger } from ".";

const PASSWORD_LENGTH = 256;
const SALT_LENGTH = 64;
const DIGEST = "sha256";
const ENCODING = "hex";
const INTERATIONS = 19321;

export async function generateHashPassword(
  password: string
): Promise<{ salt: string; hash: string }> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_LENGTH).toString(ENCODING);

    crypto.pbkdf2(
      password,
      salt,
      INTERATIONS,
      PASSWORD_LENGTH,
      DIGEST,
      (error, hash) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            salt,
            hash: hash.toString(ENCODING),
          });
        }
      }
    );
  });
}

export async function verifyPassword(
  passwordAttempt: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      passwordAttempt,
      salt,
      INTERATIONS,
      PASSWORD_LENGTH,
      DIGEST,
      (error, hash) => {
        if (error) {
          logger.error(error);
          reject(error);
        } else {
          resolve(hashedPassword === hash.toString(ENCODING));
        }
      }
    );
  });
}
