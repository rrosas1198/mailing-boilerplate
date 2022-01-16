import { randomBytes } from "crypto";

export function genUuid() {
    return randomBytes(8).toString("hex");
}
