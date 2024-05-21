// 导入change-case库中各种大小写转换函数
const {
  camelCase,
  pascalCase,
  constantCase,
  snakeCase,
  kebabCase,
  trainCase,
  noCase,
  capitalCase,
  dotCase,
  pathCase
} = require('change-case');

// 导入VS Code的扩展API
import * as vscode from 'vscode';

// 导入百度和腾讯的文本翻译函数
import { baiduTxtTranslate } from './baiduTranslate';
import { tencentTxtTranslate } from './tencentTranslate';
import { QuickPickItem } from 'vscode';

/**
 * 代码名称格式化接口定义
 * @interface CodeNameFormat
 * @property {string} name - 名称字符串
 * @property {Function} handle - 处理函数
 * @property {string} description - 描述文本
 */
interface changeCaseMap {
  name: string;
  handle: Function;
  description: string;
}
/**
 * 定义一个数组，该数组包含了不同的代码命名格式化函数及其描述。
 * 每个元素都是一个对象，包含命名格式的名称、处理函数和描述信息。
 */
const changeCaseMap: changeCaseMap[] = [
  { name: 'camelCase', handle: camelCase, description: '  驼峰(小)' },
  { name: 'pascalCase', handle: pascalCase, description: '  驼峰(大)' },
  { name: 'constantCase', handle: constantCase, description: '  常量' },
  { name: 'snakeCase', handle: snakeCase, description: '  下划线' },
  { name: 'kebabCase', handle: kebabCase, description: '  中划线(小)' },
  { name: 'trainCase', handle: trainCase, description: '  中划线(大)' },
  { name: 'noCase', handle: noCase, description: '  分词(小)' },
  { name: 'capitalCase', handle: capitalCase, description: '  分词(大)' },
  { name: 'dotCase', handle: dotCase, description: '  对象属性' },
  { name: 'pathCase', handle: pathCase, description: '  文件路径' }
];

/**
 * 异步函数，用于执行变量格式化。
 * @param str 需要格式化的字符串。
 * @param name 指定格式化的方式，默认为'all'，表示全部格式化。
 * @returns 返回一个Promise，解析为选择的格式化标签。
 */
async function variableFormatting(str: string, name: string = 'all'): Promise<string> {
  if (name === 'all') {
    // 初始化一个空数组，用于存储后续生成的项目列表。
    let items: Array<QuickPickItem> = [];

    // 遍历changeCaseMap，生成每个转换器的标签和描述，并添加到items数组中。
    for (const item of changeCaseMap) {
      items.push({
        label: item.handle(str) + item.description,
        // detail: item.description,
        description: item.name
      });
    }

    // 配置quickPick选项，如匹配描述和占位符。
    const opts = {
      matchOnDescription: true,
      placeHolder: '选择替换(choose replace )'
    };
    // 显示快速选择菜单，并等待用户选择。
    const selections = await vscode.window.showQuickPick(items, opts);

    // 如果没有选择，则直接返回undefined。
    if (!selections) {
      return '';
    }

    // 返回用户选择的标签。
    return selections.description as string;
  }
  return name;
}

/**
 * 格式化代码名称的异步函数。
 * 该函数首先检查当前是否有活跃的文本编辑器，然后对于每一个选中的文本段落，
 * 依次进行翻译、格式化，最后用处理后的文本替换原始选中文本。
 */
async function CodeNameFormatMain(cacheDictionary: { [key: string]: string }, name: string = 'all') {
  const editor = vscode.window.activeTextEditor;
  // 检查是否有活跃的文本编辑器
  if (!editor) {
    return;
  }
  // 进度渲染
  var sync = vscode.window.setStatusBarMessage(`CodeNameFormat$(sync~spin)`);
  // 遍历所有选区，对每个选中的文本进行处理
  for (const selection of editor.selections) {
    const selected = editor.document.getText(selection);
    if (selected.trim() === '') {
      continue;
    }
    // 调用翻译函数，将选中文本翻译成另一种语言
    let str = await Translate(selected, cacheDictionary);
    // 对翻译后的文本进行变量格式化处理
    name = await variableFormatting(str, name);

    const changeCaseObj = changeCaseMap.find(item => item.name === name);
    if (changeCaseObj) {
      str = changeCaseObj.handle(str);
      // 使用处理后的文本替换原始选中文本
      editor.edit(builder => builder.replace(selection, str));
    }

    await sleep(100); // 睡眠100毫秒
  }
  // 完成渲染
  // await sleep(2000); // 睡眠100毫秒

  // vscode.window.setStatusBarMessage(``);
  sync.dispose();
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * 翻译给定字符串。
 * @param str 需要翻译的字符串。
 * @returns 返回翻译后的字符串。如果未配置翻译引擎或提供必要的密钥，则返回原始字符串。
 */
async function Translate(str: string, cacheDictionary: { [key: string]: string }): Promise<string> {
  // 获取当前配置中的翻译引擎类型
  const translationEngine = vscode.workspace.getConfiguration('codeNameFormat')['translationEngine'];
  // 使用百度翻译
  if (translationEngine === 'baidu') {
    const baiduAppid = vscode.workspace.getConfiguration('codeNameFormat')['baiduAppid'];
    const baiduSecretKey = vscode.workspace.getConfiguration('codeNameFormat')['baiduSecretKey'];
    // 如果未配置百度AppID或SecretKey，则直接返回原始字符串
    if (!baiduAppid || !baiduSecretKey) {
      vscode.window.showWarningMessage('请配置百度翻译AppID和SecretKey');
      return str;
    }
    // 调用百度翻译API进行翻译
    return await baiduTxtTranslate(str, baiduAppid, baiduSecretKey, cacheDictionary);
  }
  // 使用腾讯翻译
  else if (translationEngine === 'tencent') {
    const tencentAppid = vscode.workspace.getConfiguration('codeNameFormat')['tencentSecretId'];
    const tencentSecretKey = vscode.workspace.getConfiguration('codeNameFormat')['tencentSecretKey'];
    // 如果未配置腾讯SecretId或Secret，则直接返回原始字符串
    if (!tencentAppid || !tencentSecretKey) {
      vscode.window.showWarningMessage('请配置腾讯翻译AppID和SecretKey');
      return str;
    }
    // 调用腾讯翻译API进行翻译
    return await tencentTxtTranslate(str, tencentAppid, tencentSecretKey, cacheDictionary);
  }

  // 如果未指定或配置其他翻译引擎，直接返回原始字符串
  return str;
}

export { CodeNameFormatMain, changeCaseMap };
