import { Service } from "typedi";
import Session from "express-session";
import connectRedis from "connect-redis";
import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "../config";
import { logger } from "../utils";

@Service()
export class Redis {
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
    return this.redisClient!;
  }

  private async getRedisConnection() {
    if (process.env.NODE_ENV === "test") {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.getRedisClient()
      .connect()
      .then(() => logger.info("REDIS CONNECTED"))
      .catch((err) =>
        logger.error("REDIS CONNECTED FAILED", JSON.stringify(err))
      );
  }

  getRedisStore() {
    return new this.redisStore!({ client: this.getRedisClient() });
  }

  async closeRedis() {
    await this.getRedisClient().disconnect();
    // await this.getRedisClient().quit();
  }
}
