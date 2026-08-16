import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "notification-debug.log");

export function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logLine, "utf8");
}

export function clearLogFile() {
  if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
  }
}
