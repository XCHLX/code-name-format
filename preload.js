// 导入必要的模块和函数
const tostr = require('./public/tool/string-help.js');
const { extractTranslationResults, translate } = require('./public/tool/baidu-api.js');

const BAIDU_APP_ID = 'baidu_app_id'; // 百度api
const BAIDU_SECRET_KEY = 'baidu_secret_key'; // 百度密钥

// 将插件的功能代码导出给window.exports，使其可以在其他模块中使用
window.exports = {
  // 定义第一个功能：代码列表
  'code-all': {
    mode: 'list', // 使用列表模式
    args: {
      // 当用户输入并按下回车键时执行的函数
      enter: async (action, callbackSetList) => {
        const arrayStr = await variableFormatting(action);
        // 调用回调函数，将处理后的数据展示在列表中
        callbackSetList(arrayStr);
      },
      // 当用户从列表中选择某个条目时执行的函数
      select: (action, itemData, callbackSetList) => {
        // 隐藏主窗口，并将用户选择的文本粘贴到剪贴板
        window.utools.hideMainWindow();
        utools.hideMainWindowPasteText(itemData.title);
        window.utools.outPlugin();
      }
    }
  },

  'code-camel-case': {
    mode: 'none',
    args: {
      enter: async action => {
        const arrayStr = await variableFormatting(action, 'camelCase');
        // 调用回调函数，将处理后的数据展示在列表中
        window.utools.hideMainWindow();
        if (arrayStr) {
          utools.hideMainWindowPasteText(arrayStr[0].title);
        } else {
          utools.showNotification('转换失败' + error);
        }
        window.utools.outPlugin();
      }
    }
  },
  //  设置百度翻译的APPID和Token
  setappid: {
    mode: 'list', // 使用列表模式，但无UI界面
    args: {
      // 当进入插件应用时执行的函数，用于显示列表数据
      enter: (action, callbackSetList) => {
        callbackSetList([
          {
            title: '去注册百度翻译KEY',
            description: '点击跳转注册百度翻译KEY'
          }
        ]);
      },
      // 当子输入框内容变化时执行的函数，用于动态更新列表数据
      search: (action, searchWord, callbackSetList) => {
        if (searchWord.indexOf(',')) {
          callbackSetList([
            {
              title: `${searchWord.split(',')[0]}`,
              description: 'APPID'
            },
            {
              title: `${searchWord.split(',')[1]}`,
              description: '密钥'
            },
            {
              title: `${searchWord}`,
              description: '单击保存设置'
            }
          ]);
        }
      },
      // 当用户从列表中选择某个条目时执行的函数
      select: (action, itemData, callbackSetList) => {
        window.utools.hideMainWindow();
        if (itemData.description === '单击保存设置') {
          // 保存用户选择的APPID和Token
          utools.dbStorage.setItem(BAIDU_APP_ID, itemData.title.split(',')[0]);
          utools.dbStorage.setItem(BAIDU_SECRET_KEY, itemData.title.split(',')[1]);
        }
        if (itemData.title == '去注册百度翻译KEY') {
          // 打开百度翻译注册页面
          utools.shellOpenExternal('https://hcfy.app/docs/services/baidu-api');
        }
        window.utools.outPlugin();
      },
      placeholder: '请输入百度翻译appid和密钥 ,隔开  示例 id,密钥'
    }
  }
};

/**
 * 根据指定的行动和类型，对变量进行格式化处理，包括中文字符的翻译。
 * @param {Object} action - 包含payload等数据的行动对象。
 * @param {String} type - 指定payload的处理方式。
 * @returns {String} 返回处理后的payload，转换为列表所需的格式。
 */
async function variableFormatting(action, type) {
  // 查找payload中的中文字符
  let payload = action.payload;
  const arrayQ = payload.match(/[\u4e00-\u9fa5]+/g);

  if (arrayQ) {
    // 检查是否有appid和token，用于调用百度翻译API
    let appid = utools.dbStorage.getItem(BAIDU_APP_ID);
    let secretKey = utools.dbStorage.getItem(BAIDU_SECRET_KEY);

    if (appid && secretKey) {
      // 使用appid和token调用翻译函数
      await translate(arrayQ?.join('\n'), 'auto', 'en', appid, secretKey)
        .then(result => {
          // 成功翻译后，将翻译结果替换回payload中
          payload = extractTranslationResults(JSON.parse(result), payload);
        })
        .catch(error => {
          // 翻译失败时，显示错误通知
          utools.showNotification('翻译失败' + error);
        });
    }
  }

  // 将处理后的payload转换为列表所需的格式
  const arrayStr = tostr(payload, type);
  return arrayStr;
}
