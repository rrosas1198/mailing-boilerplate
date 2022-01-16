import { create as createServer } from "browser-sync";
import { rmSync } from "fs-extra";
import { dest, parallel, series, src, task, watch } from "gulp";
import { resolve } from "pathe";
import { createImageStream } from "./tools/plugins/image.plugin";
import { loadPlugins } from "./tools/plugins/load-plugins.plugin";
import { createPaniniStream, refreshPanini } from "./tools/plugins/panini.plugin";
import { createSassStream } from "./tools/plugins/sass.plugin";
import { resolveSourceGlob, resolveWatchGlob } from "./tools/utils/globs.util";
import { resolveDistDir, resolveTmpDir } from "./tools/utils/resolve-dir.util";

const plugin = loadPlugins();
const server = createServer();

const dist = resolveDistDir();
const temp = resolveTmpDir();

const paniniStream = () => createPaniniStream();
const sassStream = () => createSassStream();

/* eslint-disable @typescript-eslint/no-explicit-any */
task("clean", done => {
    rmSync(resolve(dist), { force: true, recursive: true });
    rmSync(resolve(temp), { force: true, recursive: true });
    done();
});

task("views", () => {
    return src(resolveSourceGlob("views"))
        .pipe(plugin.plumber())
        .pipe(paniniStream())
        .pipe(createImageStream({ base64: true }))
        .pipe(plugin.inlineCss({ removeStyleTags: false }))
        .pipe(plugin.prettier())
        .pipe(dest(dist));
});

task("views:min", () => {
    return src(resolveSourceGlob("views"))
        .pipe(plugin.plumber())
        .pipe(paniniStream())
        .pipe(createImageStream({ outDir: resolveDistDir("$1/images") }))
        .pipe(plugin.inlineCss({ removeStyleTags: false }))
        .pipe(plugin.prettier())
        .pipe(
            plugin.rename((path: any) => {
                path.dirname = path.basename;
                // path.suffix = ".min";
            })
        )
        .pipe(dest(dist))
        .on("finish", () => {
            rmSync(resolve(temp), { force: true, recursive: true });
        });
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
        .pipe(dest(temp));
});

task("server", done => {
    server.init({
        server: { baseDir: dist }
    });
    done();
});

task("build", series("clean", "scss", "views"));
task("build:min", series("clean", "scss", "views:min"));

task("watch", () => {
    const reloadView = series(refreshPanini, "views");

    watch(resolveWatchGlob("views")).on("change", series(reloadView, server.reload));
    watch(resolveWatchGlob("scss")).on("change", series("scss", reloadView, server.reload));
});

task("default", series("build", parallel("server", "watch")));
