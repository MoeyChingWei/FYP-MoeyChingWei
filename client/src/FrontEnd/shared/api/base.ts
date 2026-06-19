/** Backend API base URL (no trailing slash). */
declare const __APP_ENV__: Record<string, string | undefined> | undefined;

const envApiRoot =
  typeof __APP_ENV__ !== "undefined" && __APP_ENV__
    ? __APP_ENV__.REACT_APP_API_URL
    : undefined;
const maybeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
export const API_ROOT =
  envApiRoot ??
  maybeProcess?.env?.REACT_APP_API_URL ??
  "http://localhost:4000/api";
