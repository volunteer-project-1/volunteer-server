import { format, transports, Logger, createLogger } from "winston";
import winstonDaily from "winston-daily-rotate-file";
import { Container } from "typedi";
import process from "process";
import { isProd } from "../config";

const { combine, timestamp, printf, colorize } = format;

const LOG_DIR = "logs" as const;

// eslint-disable-next-line no-shadow
const myFormat = printf(({ message, timestamp, level }) => {
  return `[#${process.pid}] ${timestamp} [${level}] ${message}`;
});

const logger: Logger = createLogger({
  exitOnError: false,
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    myFormat
  ),
  transports: [
    new transports.Console({
      format: combine(),
    }),
    // eslint-disable-next-line new-cap
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: `${LOG_DIR}/info`,
      filename: `%DATE%.log`,
      maxFiles: 20,
      zippedArchive: true,
    }),

    // eslint-disable-next-line new-cap
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${LOG_DIR}/error`,
      filename: `%DATE%.error.log`,
      maxFiles: 20,
      zippedArchive: true,
    }),
  ],
});

if (!isProd) {
  logger.add(
    new transports.Console({
      format: combine(colorize({ all: true }), myFormat),
    })
  );
}

export { logger };

Container.set("logger", logger);
