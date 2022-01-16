import gulpLoadPlugins from "gulp-load-plugins";

/* eslint-disable @typescript-eslint/no-explicit-any */
type GulpStream = (...params: any[]) => NodeJS.ReadWriteStream;

export function loadPlugins() {
    return gulpLoadPlugins<Record<string, GulpStream>>();
}
