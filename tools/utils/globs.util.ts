import { resolveSrcDir } from "./resolve-dir.util";

type GlobValue = string | string[];

const sourceGlobs = new Map<string, GlobValue>([
    ["views", resolveSrcDir("mailings/**/*.html")],
    ["scss", resolveSrcDir("mailings/**/index.scss")]
]);

const watchGlobs = new Map<string, GlobValue>([
    ["views", resolveSrcDir("{layouts,mailings,partials,helpers,data}/**/*")],
    ["scss", resolveSrcDir("**/*.{scss,SCSS}")]
]);

export const resolveSourceGlob = (name: string) => sourceGlobs.get(name) as GlobValue;
export const resolveWatchGlob = (name: string) => watchGlobs.get(name) as GlobValue;
