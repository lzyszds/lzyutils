import {ElNotification, dayjs} from 'element-plus'


// 此函数获取一个数组并将其拆分为更小的块
export function splitArray(array, size) { // 创建一个空数组以容纳较小的块
  let data = [];
  // 在原始阵列上循环
  for (let i = 0; i < array.length; i += size) { // 对于每个迭代，向新数组添加一个新块
    data.push(array.slice(i, i + size))
  }
  // return 一个新数组
  return data
}

// 时间格式化为字符串 比如说前天 几天前，几小时前
export function timeAgo(time) {
  const t = dayjs().unix() - time; // 获取当前时间戳与传入时间戳的差值
  const i = 60;
  const h = i * 60;
  const d = h * 24;
  const m = d * 30;
  const y = m * 12;
  // 使用 Map 存储时间转换的规则，每个规则由一个判断函数和一个转换函数组成
  const timeRules = new Map([
    [n => n<i, () => '一分钟'],
    [n => n<h, n =>(n / i >> 0) + '分钟'],
    [n => n<d, n =>(n / h >> 0) + '小时'],
    [n => n<m, n =>(n / d >> 0) + '天'],
    [n => n<y, n =>(n / m >> 0) + '月'],
    [
      () => true,
      n => (n / y >> 0) + '年'
    ],
  ]);
  // 通过遍历 Map 找到符合条件的规则并执行转换函数，获取时间描述字符串
  return [... timeRules].find(([n]) => n(t)).pop()(t) + '前';
}


// 视频音频时间  格式化时间
/* 视频或音频的时长转化为标准化的xx:xx:xx格式 */
export function formatDuration(time) {
  if (time > -1) {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  } else {
    return '00:00:00';
  }
}


/**
 * 将文件大小（以字节为单位）格式化为可读的字符串格式，例如：'1.25 MB'
 * @param {number} fileSize - 文件大小，以字节为单位
 * @returns {string} - 格式化后的文件大小字符串
 */
export function formatFileSize(fileSize) {

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB'
  ];
  let index = 0;

  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024;
    index++;
  }

  return fileSize.toFixed(2) + units[index];
}


/**
 * 将文件大小字符串（带单位，不区分大小写）转换为字节数
 * @param {string} fileSizeStr - 文件大小字符串，例如：'2.5 MB'
 * @returns {number} - 文件大小对应的字节数
 * @throws {Error} - 如果输入的文件大小字符串格式不正确或单位无效，将抛出错误
 */

export function fileSizeToBytes(fileSizeStr) {
  const units = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };

  const regex = /^([\d.]+)\s*(B|KB|MB|GB|TB)$/i; // 添加 i 标志，使正则匹配不区分大小写
  const match = fileSizeStr.match(regex);

  if (! match) {
    throw new Error('Invalid file size format. Must be a string with a number and a unit (B, KB, MB, GB, TB).');
  }

  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase(); // 将单位转换为大写形式

  if (! units.hasOwnProperty(unit)) {
    throw new Error('Invalid file size unit. Must be one of B, KB, MB, GB, TB.');
  }

  return num * units[unit];
}


/**
 * 将 base64 字符串转换为二进制流(Blob)对象
 * @param {string} dataurl - base64 字符串
 * @returns {Blob} - 转换后的二进制流(Blob)对象
 */
export function base64toBlob(dataurl) {
  const [header, data] = dataurl.split(",");
  const mime = header.match(/:(.*?);/)[1]; // 从头部信息中获取文件的 MIME 类型
  const bstr = atob(data); // base64 解码
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i); // 将解码后的二进制数据存储为 Uint8Array
  }
  return new Blob([u8arr], {type: mime}); // 创建 Blob 对象并返回
}

/**
 * 将二进制流(Blob)对象转换为 base64 格式
 * @param {Blob|Uint8Array} data - 二进制流(Blob)对象或 Uint8Array
 * @param {string} type - 文件的 MIME 类型
 * @returns {Promise<string>} - 返回 Promise 对象，解析为 base64 字符串结果
 */
export function getBase64(data, type) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([data], {type});
    const reader = new FileReader();
    reader.readAsDataURL(blob); // 将 Blob 对象读取为 base64 字符串
    reader.onload = () => resolve(reader.result); // 读取成功时解析 base64 字符串结果
    reader.onerror = reject; // 读取错误时拒绝错误
  });
}


// 上传图片，图片太大，如何在前端实现图片压缩后上传
export function compressPic(file, quality) {
  return new Promise((resolve, reject) => {
    getBase64(file, file.type).then((res) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = res;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 转换成base64格式 quality为图片压缩质量 0-1之间  值越小压缩的越大 图片质量越差
        const base64 = canvas.toDataURL(file.type, quality);
        const fileCompress = base64toBlob(base64);
        resolve({base64, fileCompress});
      };
      img.onerror = function (error) {
        reject("压缩失败：" + error.message);
      };
    }).catch((error) => {
      reject("获取图片数据失败：" + error.message);
    });
  });
}


// 默认弹窗
export const LNotification = (val, time = 2000, postion = 'bottom-right') => {
  ElNotification.closeAll()
  ElNotification({
    dangerouslyUseHTMLString: true,
    message: val,
    position: postion,
    duration: time,
    customClass: 'copy-success'
  })
}

// 复制内容提示版权信息
import {useEventListener} from "@vueuse/core";

export const copyTip = () => {
  useEventListener(window, 'keydown', e => {
    if (e.ctrlKey && e.key === 'c') {
      LNotification(`<i class="iconfont icon-tishi"></i> 复制成功,转载请声明来源！`)
    }
  })
}

// 提示通知
export const tipNotify = (val) => {
  const style = `color: var(--themeColor); font-size: 16px;`
  const icon = `<i class="iconfont icon-tongzhi" style="${style}"></i>`
  LNotification(`${icon} ${val}`)
}


// 获取cookie
export const getCookie = (name) => {
  let cookie = document.cookie.split('; ').map((item) => {
    return item.split('=')
  })
  cookie = Object.fromEntries(cookie)
  return cookie[name]
}

// 设置cookie
export const setCookie = (name, value, time) => {
  let date = dayjs()
  date = date.add(time, 'day')
  document.cookie = `${name}=${value};expires=${date}`
}

/* 数组去重 arr: 要处理数组, key: 去重的key值 单一数组不需要key */
export const unique = (arr, key) => {
  const res = new Map();
  return arr.filter((a) => {
    const arrKey = key ? a[key] : a
    // has判断当前值是否在map对象中存在 ,如果不存在则将当前值添加进map对象中
    return ! res.has(arrKey) && res.set(arrKey, 1)
  })
}


// 数组对象去重
// function unique(arr, key) {
// const res = new Map();
// return arr.filter((a) => {
//     // has判断当前值是否在map对象中存在 ,如果不存在则将当前值添加进map对象中
//     return !res.has(a[key]) && res.set(a[key], 1)
// })
// }
// //去重data
// const _res = new Map();
// const items = data.map((item, index) => _res.set(item.url, index))
// let newdata = [..._res.values()].map(index => {
// return data[index]
// })
// const newArr = [...new Set(arr)]
// //去重data 使用map对象
// const map = new Map();
// for (const item of data) {
// if (!map.has(item.url)) {
//     map.set(item.url, item);
// }
// }
// const result = [...map.values()];

// 时间格式化处理
export const setTime = (time) => {
  const formatted = dayjs(time).format('YYYY-MM-DD')
  return formatted
}


export default {
  splitArray, // 把一个数组拆分成几个数组
  timeAgo, // 时间转换
  formatDuration, // 视频音频时间  格式化时间
  formatFileSize, // 转换文件大小
  fileSizeToBytes, // 将文件大小字符串转换为字节数
  base64toBlob, // base64转二进制流
  getBase64, // 二进制流转换为base64 格式。
  compressPic, // 上传图片，图片太大，如何在前端实现图片压缩后上传
  copyTip, // 复制内容提示版权信息
  tipNotify, // 提示通知
  LNotification, // 提示弹窗
  getCookie, // 获取cookie
  setCookie, // 设置cookie
  unique, // 数组对象去重（区别单数组以及数组中嵌套一层对象）
  setTime, // 时间格式化处理
}
