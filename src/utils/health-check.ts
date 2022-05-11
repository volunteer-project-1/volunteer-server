import { HealthCheckError, TerminusOptions } from "@godaddy/terminus";
import Container from "typedi";
import { MySQL, Redis } from "../db";
import { logger, Emitter } from ".";

const redis = Container.get(Redis);
const mysql = Container.get(MySQL);
const emitter = Container.get(Emitter).getInstance();

function onSignal() {
  emitter.emit("offKeepAlive");
  return Promise.all([mysql.closePool(), redis.closeRedis()]);
}

function onShutdown() {
  return Promise.resolve(
    logger.info("Cleanup Finished, Server is shutting down")
  );
}

async function onHealthCheck() {
  const errors: any[] = [];
  return Promise.all([console.log("health Check")]).then(() => {
    if (errors.length) {
      throw new HealthCheckError("healthcheck failed", errors);
    }
  });
}

export const terminusOption: TerminusOptions = {
  logger: logger.info,
  signal: "SIGINT",
  healthChecks: {
    "/health": onHealthCheck,
    __unsafeExposeStackTraces: true,
  },
  onShutdown,
  onSignal,
  timeout: 5000,
};
