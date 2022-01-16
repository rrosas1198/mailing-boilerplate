import { create as createServer } from "browser-sync";
import { rmSync } from "fs";
import { dest, parallel, series, src, task, watch } from "gulp";
import { resolve } from "pathe";
import { loadPlugins } from "./tools/plugins/load-plugins.plugin";
import { createPaniniStream, refreshPanini } from "./tools/plugins/panini.plugin";
import { createSassStream } from "./tools/plugins/sass.plugin";
import { resolveSourceGlob, resolveWatchGlob } from "./tools/utils/globs.util";
import { resolveDistDir } from "./tools/utils/resolve-dir.util";

const plugin = loadPlugins();
const server = createServer();

const dist = resolveDistDir();

const paniniStream = () => createPaniniStream();
const sassStream = () => createSassStream();

task("clean", done => {
    rmSync(resolve(dist), { force: true, recursive: true });
    done();
});

task("views", () => {
    return src(resolveSourceGlob("views"))
        .pipe(plugin.plumber())
        .pipe(paniniStream())
        .pipe(plugin.prettier())
        .pipe(dest(dist));
});

task("scss", () => {
    return src(resolveSourceGlob("scss"))
        .pipe(plugin.plumber())
        .pipe(sassStream())
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

task("build", series("clean", parallel("scss", "views")));

task("watch", () => {
    watch(resolveWatchGlob("views")).on("change", series(refreshPanini, server.reload));
    watch(resolveWatchGlob("scss")).on("change", series("scss", refreshPanini, server.reload));
});

task("default", series("build", parallel("server", "watch")));
