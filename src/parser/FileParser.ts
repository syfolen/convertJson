
import xlsx from "xlsx";
import { M } from "../utils/M";
import { FileUtil } from "../utils/FileUtil";

export class FileParser {

    constructor(path: string, dfnNS: boolean) {
        const book: xlsx.WorkBook = xlsx.readFile(path);

        const name: string = FileUtil.getFileName(path);
        const comment: string = book.SheetNames[0];
        this.$writeInterfaceComment(name, comment);

        M.lines.push(`${FileUtil.TAB}export interface I${name} {`);
        const map = this.$parseSheet(book.Sheets[comment]);
        M.lines.push(FileUtil.TAB + "}");

        M.dataMap[name] = map;

        if (dfnNS === true) {
            this.$writeInterfaceComment(name, comment);
            M.lines.push(`${FileUtil.TAB}export namespace ${name}Id {`);
            this.$dfnNamespace(book.Sheets[comment]);
            M.lines.push(FileUtil.TAB + "}");
        }
    }

    private $dfnNamespace(sheet: xlsx.WorkSheet): void {
        const items: any[] = xlsx.utils.sheet_to_json(sheet);
        if (items.length === 0) {
            return null;
        }
        for (let i: number = 3; i < items.length; i++) {
            const item: any = items[i];
            M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}// ${item.zn}`);
            M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}export const ${item.code}: string = "${item.code}";`);
        }
    }

    private $writeInterfaceComment(name: string, comment: string): void {
        M.lines.push("");
        M.lines.push(`${FileUtil.TAB}/**`);
        M.lines.push(`${FileUtil.TAB} * ${comment}`);
        M.lines.push(`${FileUtil.TAB} */`);
    }

    private $writeInterfaceContent(keys: string[], types: string[], comments: string[]): void {
        for (let i: number = 0; i < keys.length; i++) {
            if (i > 0) {
                M.lines.push("");
            }
            M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}/**`);
            M.lines.push(`${FileUtil.TAB}${FileUtil.TAB} * ${comments[i]}`);
            M.lines.push(`${FileUtil.TAB}${FileUtil.TAB} */`);
            M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}${keys[i]}: ${this.$convertTypeToTSString(types[i])};`);
        }
    }

    private $convertTypeToTSString(type: string): string {
        if (type === "int" || type === "float") {
            return "number";
        }
        if (type === "int[]" || type === "float[]") {
            return "number[]";
        }
        if (type === "string" || type === "nstring") {
            return "string";
        }
        if (type === "string[]" || type === "nstring[]") {
            return "string[]";
        }
        if (type === "boolean") {
            return "boolean";
        }
        throw Error(`未知的TypeScript变量类型：${type}`);
    }

    private $parseSheet(sheet: xlsx.WorkSheet): any {
        const items: any[] = xlsx.utils.sheet_to_json(sheet);
        if (items.length === 0) {
            return null;
        }

        const keys: string[] = this.$getOutputKeys(items.shift());
        if (keys.length === 0) {
            return;
        }
        const types: string[] = this.$getOutputTypes(items.shift());
        const comments: string[] = this.$getOutputComments(items.shift());

        this.$writeInterfaceContent(keys, types, comments);

        const map: { [code: string]: any } = {};
        while (items.length > 0) {
            const item: any = items.shift();
            const data: any = {};
            for (const key of keys) {
                const index: number = keys.indexOf(key);
                const type: string = types[index];
                if (type === "boolean") {
                    if (typeof item[key] === "string" && item[key].toLowerCase() === "true") {
                        data[key] = true;
                    }
                    else {
                        data[key] = this.$getDefaultValueByType(type);
                    }
                }
                else {
                    data[key] = item[key] || this.$getDefaultValueByType(type);
                }
            }
            map[data.code] = data;
        }

        return map;
    }

    private $getOutputComments(item: any): string[] {
        const keys: string[] = Object.keys(item).slice();
        const array: string[] = [];
        for (const key of keys) {
            array.push(item[key]);
        }
        return array;
    }

    private $getOutputTypes(item: any): string[] {
        const keys: string[] = Object.keys(item).slice();
        const array: string[] = [];
        for (const key of keys) {
            array.push(item[key]);
        }
        return array;
    }

    private $getOutputKeys(item: any): string[] {
        const keys: string[] = Object.keys(item).slice();
        const array: string[] = [];
        for (const key of keys) {
            const value: string = item[key];
            if (value === "C" || value === "CS") {
                array.push(key);
            }
            else if (value === "S") {

            }
            else {
                throw Error(`错误的CS标识：${value}`);
            }
        }
        return array;
    }

    private $getDefaultValueByType(type: string): any {
        if (type === "int") {
            return 0;
        }
        if (type === "boolean") {
            return false;
        }
        if (type === "string" || type === "nstring") {
            return null;
        }
        if (type === "int[]" || type === "string[]" || type === "nstring") {
            return [];
        }
        throw Error(`未知类型：${type}`);
    }
}