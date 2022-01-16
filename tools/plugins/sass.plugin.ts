import sass from "gulp-sass";

type SassOptions = Parameters<ReturnType<typeof sass>["sync"]>[0];

const defaultOptions: SassOptions = {
    includePaths: ["node_modules"],
    outputStyle: "expanded",
    indentWidth: 4
};

export function createSassStream(options: SassOptions = defaultOptions) {
    return sass(require("sass"))({
        includePaths: options?.includePaths,
        outputStyle: options?.outputStyle,
        indentWidth: options?.indentWidth
    });
}
