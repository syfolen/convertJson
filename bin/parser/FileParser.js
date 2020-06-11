"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_1 = __importDefault(require("xlsx"));
var M_1 = require("../utils/M");
var FileUtil_1 = require("../utils/FileUtil");
var FileParser = /** @class */ (function () {
    function FileParser(path, dfnNS) {
        var book = xlsx_1.default.readFile(path);
        var name = FileUtil_1.FileUtil.getFileName(path);
        var comment = book.SheetNames[0];
        this.$writeInterfaceComment(name, comment);
        M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "export interface I" + name + " {");
        var map = this.$parseSheet(book.Sheets[comment]);
        M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "}");
        M_1.M.dataMap[name] = map;
        if (dfnNS === true) {
            this.$writeInterfaceComment(name, comment);
            M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "export namespace " + name + "Id {");
            this.$dfnNamespace(book.Sheets[comment]);
            M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "}");
        }
    }
    FileParser.prototype.$dfnNamespace = function (sheet) {
        var items = xlsx_1.default.utils.sheet_to_json(sheet);
        if (items.length === 0) {
            return null;
        }
        for (var i = 3; i < items.length; i++) {
            var item = items[i];
            M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + "// " + item.zn);
            M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + "export const " + item.code + ": string = \"" + item.code + "\";");
        }
    };
    FileParser.prototype.$writeInterfaceComment = function (name, comment) {
        M_1.M.lines.push("");
        M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "/**");
        M_1.M.lines.push(FileUtil_1.FileUtil.TAB + " * " + comment);
        M_1.M.lines.push(FileUtil_1.FileUtil.TAB + " */");
    };
    FileParser.prototype.$writeInterfaceContent = function (keys, types, comments) {
        for (var i = 0; i < keys.length; i++) {
            if (i > 0) {
                M_1.M.lines.push("");
            }
            M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + "/**");
            M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + " * " + comments[i]);
            M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + " */");
            M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + keys[i] + ": " + this.$convertTypeToTSString(types[i]) + ";");
        }
    };
    FileParser.prototype.$convertTypeToTSString = function (type) {
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
        throw Error("\u672A\u77E5\u7684TypeScript\u53D8\u91CF\u7C7B\u578B\uFF1A" + type);
    };
    FileParser.prototype.$parseSheet = function (sheet) {
        var items = xlsx_1.default.utils.sheet_to_json(sheet);
        if (items.length === 0) {
            return null;
        }
        var keys = this.$getOutputKeys(items.shift());
        if (keys.length === 0) {
            return;
        }
        var types = this.$getOutputTypes(items.shift());
        var comments = this.$getOutputComments(items.shift());
        this.$writeInterfaceContent(keys, types, comments);
        var map = {};
        while (items.length > 0) {
            var item = items.shift();
            var data = {};
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var index = keys.indexOf(key);
                var type = types[index];
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
    };
    FileParser.prototype.$getOutputComments = function (item) {
        var keys = Object.keys(item).slice();
        var array = [];
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            array.push(item[key]);
        }
        return array;
    };
    FileParser.prototype.$getOutputTypes = function (item) {
        var keys = Object.keys(item).slice();
        var array = [];
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var key = keys_3[_i];
            array.push(item[key]);
        }
        return array;
    };
    FileParser.prototype.$getOutputKeys = function (item) {
        var keys = Object.keys(item).slice();
        var array = [];
        for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
            var key = keys_4[_i];
            var value = item[key];
            if (value === "C" || value === "CS") {
                array.push(key);
            }
            else if (value === "S") {
            }
            else {
                throw Error("\u9519\u8BEF\u7684CS\u6807\u8BC6\uFF1A" + value);
            }
        }
        return array;
    };
    FileParser.prototype.$getDefaultValueByType = function (type) {
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
        throw Error("\u672A\u77E5\u7C7B\u578B\uFF1A" + type);
    };
    return FileParser;
}());
exports.FileParser = FileParser;
//# sourceMappingURL=FileParser.js.map