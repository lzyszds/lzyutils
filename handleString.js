/**
 * 字符串处理
  */
export default {
  // 首字母大写
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  // 首字母小写
  decapitalize: (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
  // 驼峰转换下划线
  camelToUnderline: (str) => {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  },
  // 下划线转换驼峰
  underlineToCamel: (str) => {
    return str.replace(/_(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
  },
  // 字符串反转
  reverseString: (str) => {
    return str.split('').reverse().join('');
  },
  // 字符串去重
  uniqueString: (str) => {
    return [...new Set(str)].join('');
  },
  // 字符串统计
  countString: (str) => {
    return str.split('').reduce((acc, cur) => {
      acc[cur] ? acc[cur]++ : acc[cur] = 1;
      return acc;
    }, {});
  },
  // 字符串去空格
  trimString: (str) => {
    return str.replace(/\s/g, '');
  },
  // 字符串去除特殊字符
  removeSpecialCharacter: (str) => {
    return str.replace(/[^\w\s]/gi, '');
  },
  // 字符串首尾去除特殊字符
  trimSpecialCharacter: (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '').replace(/[^\w\s]/gi, '');
  },
  // 字符串首尾去除特殊字符和空格
  trimAll: (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '').replace(/[^\w\s]/gi, '');
  },
  // 字符串首尾去除空格
  trim: (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  },
  // 字符串首尾去除空格和特殊字符 
  trimSpecial: (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '').replace(/[^\w\s]/gi, '');
  },
  // 检查字符串是否以指定的子字符串开头
  startsWith: (str, prefix) => {
    return str.startsWith(prefix);
  },

  // 检查字符串是否以指定的子字符串结尾
  endsWith: (str, suffix) => {
    return str.endsWith(suffix);
  },

}
