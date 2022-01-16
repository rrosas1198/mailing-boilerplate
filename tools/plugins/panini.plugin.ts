import { resolveSrcDir } from "../utils/resolve-dir.util";

const panini = require("panini");

interface PaniniOptions {
    root: string;
    layouts: string;
    partials?: string;
    pageLayouts?: Record<string, string>;
    helpers?: string;
    data?: string;
}

const defaultOptions: PaniniOptions = {
    root: resolveSrcDir("mailings"),
    layouts: resolveSrcDir("layouts"),
    partials: resolveSrcDir("partials"),
    helpers: resolveSrcDir("helpers"),
    data: resolveSrcDir("data")
};

export function refreshPanini(done: () => void) {
    panini.refresh();
    done();
}

export function createPaniniStream(options: PaniniOptions = defaultOptions) {
    return panini({
        root: options.root,
        layouts: options.layouts,
        partials: options.partials,
        // See: https://github.com/foundation/panini#pagelayouts
        pageLayouts: options.pageLayouts,
        helpers: options.helpers,
        data: options.data
    });
}
