"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUtil_1 = require("./utils/FileUtil");
var FileParser_1 = require("./parser/FileParser");
var M_1 = require("./utils/M");
var StringUtil_1 = require("./utils/StringUtil");
main();
function main() {
    var args = process.argv.slice(2);
    FileUtil_1.FileUtil.root = args[0] || "E:\\work\\sanguo\\conf";
    console.log("compile " + FileUtil_1.FileUtil.root);
    var lines = FileUtil_1.FileUtil.readAllLines(FileUtil_1.FileUtil.getAbsolutePath("client.txt"));
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        new FileParser_1.FileParser(FileUtil_1.FileUtil.getAbsolutePath(getFileName(line) + ".xlsx"), needDfnNamespace(line));
    }
    writeComment(lines);
    FileUtil_1.FileUtil.writeAllLines("client\\DBCfg.ts", M_1.M.lines);
    FileUtil_1.FileUtil.writeFile("client\\gamedata.json", JSON.stringify(M_1.M.dataMap));
}
function writeComment(lines) {
    M_1.M.lines.push("}");
    M_1.M.lines.push("");
    M_1.M.lines.unshift(FileUtil_1.FileUtil.TAB + "}");
    M_1.M.lines.unshift("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + "MAX");
    while (lines.length > 0) {
        M_1.M.lines.unshift("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + getFileName(lines.pop()) + ",");
    }
    M_1.M.lines.unshift(FileUtil_1.FileUtil.TAB + "export enum Cfg {");
    M_1.M.lines.unshift(FileUtil_1.FileUtil.TAB + " */");
    M_1.M.lines.unshift(FileUtil_1.FileUtil.TAB + " * \u5B9A\u4E49\u5404\u79CD\u914D\u7F6E\u6587\u4EF6\u7684\u679A\u4E3E");
    M_1.M.lines.unshift(FileUtil_1.FileUtil.TAB + "/**");
    M_1.M.lines.unshift("export namespace DBCfg {");
    M_1.M.lines.unshift(" */");
    M_1.M.lines.unshift(" * \u672C\u5730\u6570\u636E\u63A5\u53E3");
    M_1.M.lines.unshift("/**");
    M_1.M.lines.unshift("");
}
function needDfnNamespace(line) {
    if (line.indexOf("=") === -1) {
        return false;
    }
    var array = line.split("=");
    if (StringUtil_1.StringUtil.trim(array[1]) === "1") {
        return true;
    }
    return false;
}
function getFileName(line) {
    if (line.indexOf("=") === -1) {
        return line;
    }
    var array = line.split("=");
    return StringUtil_1.StringUtil.trim(array[0]);
}
//# sourceMappingURL=main.js.map