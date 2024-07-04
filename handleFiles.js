// 获取文件夹下资源文件(指定类型)
export async function getResourceFiles(fse, folderPath, type) {
  try {
    // 读取文件夹内容
    const files = await fse.readdir(folderPath);

    // 定义资源文件扩展名
    let resourceExtensions = ''

    if (type == 'video') {
      resourceExtensions = ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv'];
    } else if (type == 'image') {
      resourceExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
    }

    // 过滤资源文件
    const resourceFiles = files.filter(file => {
      const ext = getFileExtension(file).toLowerCase();
      return resourceExtensions.includes(ext);
    });

    // 返回资源文件名列表
    return resourceFiles;
  } catch (error) {
    console.error('Error reading folder:', error);
    return [];
  }
}

// 获取文件扩展名
//获取文件扩展名
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
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

  if (!match) {
    throw new Error('Invalid file size format. Must be a string with a number and a unit (B, KB, MB, GB, TB).');
  }

  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase(); // 将单位转换为大写形式

  if (!units.hasOwnProperty(unit)) {
    throw new Error('Invalid file size unit. Must be one of B, KB, MB, GB, TB.');
  }

  return num * units[unit];
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
        resolve({ base64, fileCompress });
      };
      img.onerror = function (error) {
        reject("压缩失败：" + error.message);
      };
    }).catch((error) => {
      reject("获取图片数据失败：" + error.message);
    });
  });
}
