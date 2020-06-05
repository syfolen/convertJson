import { FileUtil } from "./utils/FileUtil";
import { FileParser } from "./parser/FileParser";
import { M } from "./utils/M";
import { StringUtil } from "./utils/StringUtil";

main();

function main(): void {
    const args: string[] = process.argv.slice(2);
    FileUtil.root = args[0] || "E:\\work\\sanguo\\conf";
    console.log(`compile ${FileUtil.root}`);

    const lines: string[] = FileUtil.readAllLines(FileUtil.getAbsolutePath("client.txt"));
    for (let line of lines) {
        new FileParser(FileUtil.getAbsolutePath(getFileName(line) + ".xlsx"), needDfnNamespace(line));
    }

    writeComment(lines);
    FileUtil.writeAllLines("client\\DBCfg.ts", M.lines);
    FileUtil.writeFile("client\\gamedata.json", JSON.stringify(M.dataMap));
}

function writeComment(lines: string[]): void {
    M.lines.push("}");
    M.lines.push("");

    M.lines.unshift(`${FileUtil.TAB}}`);
    M.lines.unshift(`${FileUtil.TAB}${FileUtil.TAB}MAX`);
    while (lines.length > 0) {
        M.lines.unshift(`${FileUtil.TAB}${FileUtil.TAB}${getFileName(lines.pop())},`);
    }
    M.lines.unshift(`${FileUtil.TAB}export enum Cfg {`);
    M.lines.unshift(`${FileUtil.TAB} */`);
    M.lines.unshift(`${FileUtil.TAB} * 定义各种配置文件的枚举`);
    M.lines.unshift(`${FileUtil.TAB}/**`);
    M.lines.unshift("export namespace DBCfg {");
    M.lines.unshift(` */`);
    M.lines.unshift(` * 本地数据接口`);
    M.lines.unshift(`/**`);
    M.lines.unshift("");
}

function needDfnNamespace(line: string): boolean {
    if (line.indexOf("=") === -1) {
        return false;
    }
    const array: string[] = line.split("=");
    if (StringUtil.trim(array[1]) === "1") {
        return true;
    }
    return false;
}

function getFileName(line: string): string {
    if (line.indexOf("=") === -1) {
        return line;
    }
    const array: string[] = line.split("=");
    return StringUtil.trim(array[0]);
}