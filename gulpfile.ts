import { create as createServer } from "browser-sync";
import { dest, series, src, task, watch } from "gulp";
import loadPlugins from "gulp-load-plugins";
import { join } from "pathe";
const panini = require("panini");

const plugin = loadPlugins<Record<string, () => NodeJS.ReadWriteStream>>();
const server = createServer();

const resolveDir = (...paths: string[]) => join("src", ...paths);

task("template", () => {
    return src(resolveDir("mailings/**/*.html"))
        .pipe(plugin.plumber())
        .pipe(
            panini({
                root: resolveDir("mailings"),
                layouts: resolveDir("layouts"),
                partials: resolveDir("partials"),
                helpers: resolveDir("helpers"),
                data: resolveDir("data")
            })
        )
        .pipe(dest("dist"));
});

task("server", done => {
    server.init({
        server: { baseDir: "dist" }
    });
    done();
});

task("build", series("template"));

task("watch", () => {
    watch(
        "./src/{layouts,mailings,partials,helpers,data}/**/*",
        series(panini.refresh, server.reload)
    );
});

task("default", series("build"));
