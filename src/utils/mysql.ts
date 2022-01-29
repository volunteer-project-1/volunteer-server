import { Service } from "typedi";
import mysql from "mysql2";
import { logger } from ".";
import { DB_CONFIG } from "../config";

@Service()
class MySQL {
  private static pool: mysql.Pool;

  static async connect() {
    try {
      this.pool = mysql.createPool(DB_CONFIG);
      //   await createConnection({
      //     type: "mysql",
      //     host: process.env.DB_HOST,
      //     port: 3306,
      //     username: process.env.DB_USERNAME,
      //     password: process.env.DB_PASSWORD,
      //     database: process.env.DATABASE,
      //     entities: [`${__dirname}/models/*.js`],
      //     synchronize: true,
      //     logging: false,
      //   });
      logger.info("DB CONNECTED");
    } catch (err) {
      logger.error(err);
    }
  }

  getPool(query: string, { id }: { id: string }) {
    return MySQL.pool.promise().query(query, [id]);
  }
}

export default MySQL;
