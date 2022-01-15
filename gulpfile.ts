import { create as createServer } from "browser-sync";
import { rmSync } from "fs";
import { dest, parallel, series, src, task, watch } from "gulp";
import loadPlugins from "gulp-load-plugins";
import { resolve } from "pathe";
import { resolveSourceGlob, resolveWatchGlob } from "./tools/globs.util";
import { resolveDistDir, resolveSrcDir } from "./tools/resolve-dir.util";

/* eslint-disable @typescript-eslint/no-explicit-any */
type GulpStream = (...params: any[]) => NodeJS.ReadWriteStream;

const panini = require("panini");
const gulpSass = require("gulp-sass")(require("sass")) as GulpStream;

const plugin = loadPlugins<Record<string, GulpStream>>();
const server = createServer();

const dist = resolveDistDir();

task("clean", done => {
    rmSync(resolve(dist), { force: true, recursive: true });
    done();
});

task("templates", () => {
    return src(resolveSourceGlob("templates"))
        .pipe(plugin.plumber())
        .pipe(
            panini({
                root: resolveSrcDir("mailings"),
                layouts: resolveSrcDir("layouts"),
                partials: resolveSrcDir("partials"),
                // See: https://github.com/foundation/panini#pagelayouts
                pageLayouts: {},
                helpers: resolveSrcDir("helpers"),
                data: resolveSrcDir("data")
            })
        )
        .pipe(plugin.prettier())
        .pipe(dest(dist));
});

task("styles", () => {
    return src(resolveSourceGlob("styles"))
        .pipe(plugin.plumber())
        .pipe(gulpSass())
        .pipe(
            plugin.postcss([
                require("postcss-preset-env")({ stage: 2 })
                // require("cssnano")({ preset: "advanced" })
            ])
        )
        .pipe(plugin.prettier())
        .pipe(plugin.rename({ extname: ".css" }))
        .pipe(dest(dist));
});

task("server", done => {
    server.init({
        server: { baseDir: dist }
    });
    done();
});

task("build", series("clean", parallel("templates", "styles")));

task("watch", () => {
    watch(resolveWatchGlob("templates")).on("change", series(panini.refresh, server.reload));
    watch(resolveWatchGlob("styles")).on("change", series("styles", server.reload));
});

task("default", series("build", parallel("server", "watch")));
