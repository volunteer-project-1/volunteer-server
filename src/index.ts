// import https from "https";
import http from "http";
// import fs from "fs";
// import path from "path";
import { startApp } from "./app";
import { PORT } from "./config";
// import { PORT, HTTPS_PORT } from "./config";
import { logger } from "./utils";

startApp().then((app) => {
  //   const option = {
  //     key: fs.readFileSync(path.join(__dirname, "../src/localhost-key.pem")),
  //     cert: fs.readFileSync(path.join(__dirname, "../src/localhost.pem")),
  //   };
  //   https.createServer(option, app).listen(HTTPS_PORT, () => {
  //     logger.info(`
  //                 ################################################
  //                 🛡️ HTTPS  Server listening on port: ${HTTPS_PORT} 🛡️
  //                 ################################################
  //                 `);
  //   });

  http.createServer(app).listen(PORT, () => {
    logger.info(`
                ################################################
                🛡️ HTTP  Server listening on port: ${PORT} / ${process.env.NODE_ENV} 🛡️
                ################################################
                `);
  });
  //   app.listen(PORT, () => {
  //     logger.info(`
  //             ################################################
  //             🛡️  Server listening on port: ${PORT} 🛡️
  //             ################################################
  //             `);
  //   });
});
