import { LoggerService } from "../LoggerService";

test("Set log level", () => {
  process.env.LOG_LEVEL = "verbose";
  const logger = LoggerService.createLogger();

  expect(logger.level).toBe(process.env.LOG_LEVEL);
});
