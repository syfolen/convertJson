"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtil;
(function (StringUtil) {
    function replaceAll(str, oldStr, newStr) {
        while (str.indexOf(oldStr) > -1) {
            str = str.replace(oldStr, newStr);
        }
        return str;
    }
    StringUtil.replaceAll = replaceAll;
    function trim(str) {
        var chrs = ["\t", " "];
        for (var _i = 0, chrs_1 = chrs; _i < chrs_1.length; _i++) {
            var chr = chrs_1[_i];
            while (str.length > 0 && str.charAt(0) === chr) {
                str = str.substr(1);
            }
            while (str.length > 0 && str.charAt(str.length - 1) === chr) {
                str = str.substr(0, str.length - 1);
            }
        }
        return str;
    }
    StringUtil.trim = trim;
})(StringUtil = exports.StringUtil || (exports.StringUtil = {}));
//# sourceMappingURL=StringUtil.js.map