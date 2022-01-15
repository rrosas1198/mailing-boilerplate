import { create as createServer } from "browser-sync";
import { dest, series, src, task, watch } from "gulp";
import loadPlugins from "gulp-load-plugins";
import { resolveSourceGlob, resolveWatchGlob } from "./tools/globs.util";
import { resolveDistDir, resolveSrcDir } from "./tools/resolve-dir.util";
const panini = require("panini");

const plugin = loadPlugins<Record<string, () => NodeJS.ReadWriteStream>>();
const server = createServer();

const dist = resolveDistDir();

task("templates", () => {
    return src(resolveSourceGlob("templates"))
        .pipe(plugin.plumber())
        .pipe(
            panini({
                root: resolveSrcDir("mailings"),
                layouts: resolveSrcDir("layouts"),
                partials: resolveSrcDir("partials"),
                helpers: resolveSrcDir("helpers"),
                data: resolveSrcDir("data")
            })
        )
        .pipe(dest(dist));
});

task("server", done => {
    server.init({
        server: { baseDir: dist }
    });
    done();
});

task("build", series("templates"));

task("watch", () => {
    watch(resolveWatchGlob("templates")).on("change", series(panini.refresh, server.reload));
});

task("default", series("build"));
