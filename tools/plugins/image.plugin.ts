import { Element, load } from "cheerio";
import { ensureFileSync, readFileSync, writeFileSync } from "fs-extra";
import mime from "mime";
import { basename, join } from "pathe";
import sharp from "sharp";
import { obj } from "through2";
import File from "vinyl";
import { genUuid } from "../utils/uuid.util";

interface Options {
    base64?: boolean;
    outDir?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createImageStream(options: Options) {
    function transformImage(element: Element, file: any, output: string) {
        const source = element.attribs.src;

        if (!source) {
            return output;
        }

        const fullPath = join(file.base, source);

        if (options.base64 && !options.outDir) {
            const mimeType = (mime as any).getType(fullPath);

            if (mimeType && mimeType !== "application/octet-stream") {
                const base64 = genBase64FromFile(fullPath);
                output = output.replace(source, `data:${mimeType};base64,${base64}`);
            }
        }

        if (options.outDir && !options.base64) {
            const dirname = basename(file.history[0], ".html");
            const filename = `${genUuid()}.png`;
            const outputPath = join(process.cwd(), options.outDir.replace("$1", dirname), filename);

            void saveOptimizedImage(fullPath, outputPath);

            output = output.replace(source, `./${join("images", filename)}`);
        }

        return output;
    }

    return obj((file: File, _enc, callback) => {
        let output = String(file.contents);

        const $document = load(String(file.contents));

        $document("img").each((_index, element) => {
            output = transformImage(element, file, output);
        });

        file.contents = Buffer.from(output);

        return callback(null, file);
    });
}

function genBase64FromFile(path: string) {
    return Buffer.from(readFileSync(path)).toString("base64");
}

function genOptimizedImage(path: string) {
    return sharp(path)
        .toFormat("png", { compressionLevel: 1, force: false, quality: 100, progressive: true })
        .toBuffer();
}

async function saveOptimizedImage(inputPath: string, outputPath: string) {
    const optimizedImage = await genOptimizedImage(inputPath);

    ensureFileSync(outputPath);
    writeFileSync(outputPath, optimizedImage);
}
