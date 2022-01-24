import { Service } from "typedi";
import { createConnection } from "typeorm";
import { logger } from ".";

@Service("MySQL")
class MySQL {
  constructor() {
    // this.poolCluster = null;
  }

  static async connect() {
    try {
      await createConnection({
        type: "mysql",
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        entities: [__dirname + "/models/*.js"],
        synchronize: true,
        logging: false,
      });
      logger.info("DB CONNECTED");
    } catch (err) {
      logger.error(err);
    }
  }
}

export default MySQL;
