import fs from "fs";
import path from "path";

export function getServerTefAsarPath(): string {
  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) {
    return "";
  }
  return path.join(
    localAppData,
    "Programs",
    "server-dll-tef",
    "resources",
    "app.asar"
  );
}

export function getServerTefInstalledVersion(): string | null {
  try {
    const asarPath = getServerTefAsarPath();
    if (!asarPath || !fs.existsSync(asarPath)) {
      return null;
    }
    const pkgPath = path.join(asarPath, "package.json");
    const raw = fs.readFileSync(pkgPath, "utf-8");
    const pkg = JSON.parse(raw) as { version?: string };
    return pkg.version ?? null;
  } catch {
    return null;
  }
}
