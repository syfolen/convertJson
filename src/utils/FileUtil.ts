
import fs from "fs";
import { StringUtil } from "./StringUtil";

export namespace FileUtil {

    export const TAB: string = "    ";

    export const NEWLINE: string = "\r\n";

    export const SEPARATOR: string = "\\";

    export let root: string = null;

    export function getAbsolutePath(...args: string[]): string {
        if (FileUtil.root === null) {
            throw Error(`根目录未设置`);
        }
        const path: string = args[0];
        if (path.indexOf(":\\") === -1) {
            args.unshift(FileUtil.root);
        }
        return FileUtil.checkSeparators(args.join(FileUtil.SEPARATOR));
    }

    export function checkSeparators(path: string): string {
        const separators: string[] = ["\\", "/"];
        if (separators[1] === FileUtil.SEPARATOR) {
            separators.push(separators.shift());
        }
        return StringUtil.replaceAll(path, separators[1], separators[0]);
    }

    export function readAllLines(path: string): string[] {
        let str: string = fs.readFileSync(path).toString("utf8");
        str = StringUtil.replaceAll(str, "\r", "");

        const lines: string[] = str.split("\n");
        for (let i: number = lines.length - 1; i > -1; i--) {
            if (StringUtil.trim(lines[i]) === "") {
                lines.splice(i, 1);
            }
        }
        return lines;
    }

    export function writeFile(path: string, data: string): void {
        fs.writeFileSync(FileUtil.getAbsolutePath(path), data);
    }

    export function writeAllLines(path: string, lines: string[]): void {
        FileUtil.writeFile(path, lines.join(FileUtil.NEWLINE));
    }

    export function getFileExtension(path: string): string {
        const index: number = path.lastIndexOf(".");
        if (index === -1) {
            return null;
        }
        else {
            return path.substr(index + 1).toLowerCase();
        }
    }

    export function getFileName(path: string): string {
        const index: number = path.lastIndexOf(FileUtil.SEPARATOR);
        if (index > -1) {
            path = path.substr(index + 1);
        }
        const suffix: string = FileUtil.getFileExtension(path);
        return path.substr(0, path.length - suffix.length - 1);
    }
}