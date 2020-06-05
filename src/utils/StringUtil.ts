
export namespace StringUtil {

    export function replaceAll(str: string, oldStr: string, newStr: string): string {
        while (str.indexOf(oldStr) > -1) {
            str = str.replace(oldStr, newStr);
        }
        return str;
    }

    export function trim(str: string): string {
        const chrs: string[] = ["\t", " "];
        for (const chr of chrs) {
            while (str.length > 0 && str.charAt(0) === chr) {
                str = str.substr(1);
            }
            while (str.length > 0 && str.charAt(str.length - 1) === chr) {
                str = str.substr(0, str.length - 1);
            }
        }
        return str;
    }
}