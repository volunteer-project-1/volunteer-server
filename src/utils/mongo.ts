import mongoose from "mongoose";

import { Service } from "typedi";
import { logger } from ".";
import colors from "colors";
import config from "../config";

@Service("Mongo")
class Mongo {
  static async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        autoIndex: true,
        ignoreUndefined: true,
      };

      if (process.env.MONGO_ATLAS_URL) {
        await mongoose.connect(config.mongoURL, options);
        logger.info(colors.green("MONGODB ATLAS CONNECTED"));
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

export default Mongo;
