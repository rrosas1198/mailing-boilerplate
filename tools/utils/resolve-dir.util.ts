import { join } from "pathe";

export const resolveSrcDir = (...paths: string[]) => join("src", ...paths);
export const resolveDistDir = (...paths: string[]) => join("dist", ...paths);
