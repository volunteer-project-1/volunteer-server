import { Service } from "typedi";
import { createPool, PoolConnection } from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import { logger } from ".";
import { DB_CONFIG } from "../config";

@Service()
export class MySQL {
  private pool: Pool | undefined;

  private connection: PoolConnection | undefined;

  async connect() {
    try {
      this.pool = createPool(DB_CONFIG);
      this.connection = await this.pool.getConnection();

      logger.info("DB CONNECTED");
    } catch (err) {
      logger.error(err);
    }
  }

  async getConnection() {
    return this.connection!;
  }
}
