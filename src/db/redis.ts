import { Service } from "typedi";
import Session from "express-session";
import connectRedis from "connect-redis";
import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "../config";
import { logger } from "../utils";

@Service()
export class RedisSession {
  private retry = 0;

  private redisStore: connectRedis.RedisStore | undefined;

  private redisClient!: RedisClientType;

  async initialize(session: typeof Session) {
    this.setRedisClient();
    await this.getRedisConnection();

    this.setRedisStore(session);
  }

  private setRedisStore(session: typeof Session) {
    this.redisStore = connectRedis(session);
  }

  private setRedisClient() {
    this.redisClient = createClient({ legacyMode: true, url: REDIS_URL });
  }

  private getRedisClient() {
    if (!this.redisClient) {
      throw new Error("레디스 클라 없음?");
    }
    return this.redisClient;
  }

  private async getRedisConnection() {
    if (process.env.NODE_ENV === "test") {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.getRedisClient()
      .connect()
      .then(() => logger.info("REDIS CONNECTED"))
      .catch(async (err) => {
        if (this.retry > 3) {
          logger.error(
            `REDIS CONNECTED FAILED, OVER ${this.retry} try ,${JSON.stringify(
              err
            )}`
          );
          process.kill(process.pid, "SIGINT");
          return;
        }
        logger.error("REDIS CONNECTED FAILED", JSON.stringify(err));
        logger.info("Retry Redis Connection");
        this.retry += 1;
        await this.getRedisConnection();
      });
  }

  getRedisStore() {
    return new this.redisStore!({ client: this.getRedisClient() });
  }

  async getPing() {
    return this.getRedisClient().ping();
  }

  async closeRedis() {
    return this.getRedisClient()
      .disconnect()
      .then(() => {
        logger.info("Redis is Disconnected");
      });
  }
}
