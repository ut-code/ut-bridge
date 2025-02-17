export function log(...log: unknown[]) {
  console.log(...log);
}
export function error(...err: unknown[]) {
  console.error(...err);
}

const logger = {
  log,
  error,
};
export default logger;
