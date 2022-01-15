import { resolveSrcDir } from "./resolve-dir.util";

const sourceGlobs = new Map<string, string>([
    ["templates", resolveSrcDir("mailings/**/*.html")],
    ["styles", resolveSrcDir("mailings/**/index.scss")]
]);

const watchGlobs = new Map<string, string>([
    ["templates", resolveSrcDir("{layouts,mailings,partials,helpers,data}/**/*")],
    ["styles", resolveSrcDir("mailings/**/*.{scss,SCSS}")]
]);

export const resolveSourceGlob = (name: string) => sourceGlobs.get(name) as string;
export const resolveWatchGlob = (name: string) => watchGlobs.get(name) as string;
