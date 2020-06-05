"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var StringUtil_1 = require("./StringUtil");
var FileUtil;
(function (FileUtil) {
    FileUtil.TAB = "    ";
    FileUtil.NEWLINE = "\r\n";
    FileUtil.SEPARATOR = "\\";
    FileUtil.root = null;
    function getAbsolutePath() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (FileUtil.root === null) {
            throw Error("\u6839\u76EE\u5F55\u672A\u8BBE\u7F6E");
        }
        var path = args[0];
        if (path.indexOf(":\\") === -1) {
            args.unshift(FileUtil.root);
        }
        return FileUtil.checkSeparators(args.join(FileUtil.SEPARATOR));
    }
    FileUtil.getAbsolutePath = getAbsolutePath;
    function checkSeparators(path) {
        var separators = ["\\", "/"];
        if (separators[1] === FileUtil.SEPARATOR) {
            separators.push(separators.shift());
        }
        return StringUtil_1.StringUtil.replaceAll(path, separators[1], separators[0]);
    }
    FileUtil.checkSeparators = checkSeparators;
    function readAllLines(path) {
        var str = fs_1.default.readFileSync(path).toString("utf8");
        str = StringUtil_1.StringUtil.replaceAll(str, "\r", "");
        var lines = str.split("\n");
        for (var i = lines.length - 1; i > -1; i--) {
            if (StringUtil_1.StringUtil.trim(lines[i]) === "") {
                lines.splice(i, 1);
            }
        }
        return lines;
    }
    FileUtil.readAllLines = readAllLines;
    function writeFile(path, data) {
        fs_1.default.writeFileSync(FileUtil.getAbsolutePath(path), data);
    }
    FileUtil.writeFile = writeFile;
    function writeAllLines(path, lines) {
        FileUtil.writeFile(path, lines.join(FileUtil.NEWLINE));
    }
    FileUtil.writeAllLines = writeAllLines;
    function getFileExtension(path) {
        var index = path.lastIndexOf(".");
        if (index === -1) {
            return null;
        }
        else {
            return path.substr(index + 1).toLowerCase();
        }
    }
    FileUtil.getFileExtension = getFileExtension;
    function getFileName(path) {
        var index = path.lastIndexOf(FileUtil.SEPARATOR);
        if (index > -1) {
            path = path.substr(index + 1);
        }
        var suffix = FileUtil.getFileExtension(path);
        return path.substr(0, path.length - suffix.length - 1);
    }
    FileUtil.getFileName = getFileName;
})(FileUtil = exports.FileUtil || (exports.FileUtil = {}));
//# sourceMappingURL=FileUtil.js.map