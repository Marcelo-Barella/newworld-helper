import path from "node:path";

export function resolveDataDir(): string {
  const configured = process.env.DATA_DIR;
  if (configured) {
    return path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
  }
  return path.resolve(process.cwd(), "../../data");
}

export function apiPort(): number {
  const raw = process.env.API_PORT ?? "4000";
  const port = Number.parseInt(raw, 10);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid API_PORT: ${raw}`);
  }
  return port;
}