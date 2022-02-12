import { Service } from "typedi";
import { createPool } from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import { logger } from "../utils";
import { DB_CONFIG } from "../config";

@Service()
export class MySQL {
  private pool: Pool | undefined;

  async connect() {
    try {
      this.pool = createPool(DB_CONFIG);

      logger.info("DB CONNECTED");
    } catch (err) {
      logger.error(err);
    }
  }

  async getPool() {
    return this.pool!;
  }
}
