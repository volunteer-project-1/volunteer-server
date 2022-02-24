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
      if (this.pool) {
        return;
      }
      this.pool = createPool(DB_CONFIG);

      logger.info("DB CONNECTED");
    } catch (err) {
      logger.error(err);
    }
  }

  getPool() {
    if (!this.pool) {
      logger.info("DB RE CONNECTED");
      this.pool = createPool(DB_CONFIG);
    }
    return this.pool;
  }

  getConnection() {
    return this.getPool().getConnection();
  }

  closePool() {
    return this.pool?.end();
  }
}
