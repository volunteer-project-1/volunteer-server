import http from "http";
import { createTerminus } from "@godaddy/terminus";
import { startApp } from "./app";
import { PORT } from "./config";
import { logger } from "./utils";
import { terminusOption } from "./utils/health-check";
// import https from "https";
// import fs from "fs";
// import path from "path";
// import { PORT, HTTPS_PORT } from "./config";
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

  const server = http.createServer(app);

  createTerminus(server, terminusOption);

  server.listen(PORT, () => {
    if (process.send) {
      (<any>process).send("ready");
    }
    logger.info(`
            ################################################
            🛡️ HTTP  Server listening on port: ${PORT} / ${process.env.NODE_ENV} 🛡️
            ################################################
                `);
  });
});
