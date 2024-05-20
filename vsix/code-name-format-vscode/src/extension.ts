// 导入VS Code的扩展API
import * as vscode from 'vscode';
import { CodeNameFormatMain, changeCaseMap } from './tools/codeNameFormat';

// 声明翻译缓存字典
const cacheDictionary: { [key: string]: string } = {};

/**
 * 激活扩展时的入口函数。
 * @param context VS Code扩展上下文，用于注册命令和管理扩展生命周期。
 */
export function activate(context: vscode.ExtensionContext) {
  // vscode.window.showInformationMessage('CodeNameFormat 激活成功');

  const statusBarContent = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarContent.text = `$(check-all)CodeNameFormat`;
  // statusBarContent.command = 'codeNameFormat.default';
  statusBarContent.show();

  // 注册全部格式转换的命令
  let all = vscode.commands.registerCommand('codeNameFormat.all', async () => {
    await CodeNameFormatMain(cacheDictionary);
  });
  // 注册默认格式转换的命令，会读取配置中的默认格式并展示信息
  let def = vscode.commands.registerCommand('codeNameFormat.default', async () => {
    const defaultFormat = vscode.workspace.getConfiguration('codeNameFormat')['defaultFormat'];
    await CodeNameFormatMain(cacheDictionary, defaultFormat);
  });

  // 将注册的命令添加到订阅中，以便在扩展被禁用时进行清理
  context.subscriptions.push(all);
  context.subscriptions.push(def);
  // 循环注册额外的格式转换命令，每个格式对应一个命令
  for (const item of changeCaseMap) {
    context.subscriptions.push(
      vscode.commands.registerCommand(`codeNameFormat.${item.name}`, async () => {
        // vscode.window.showInformationMessage(item.description);
        await CodeNameFormatMain(cacheDictionary, item.name);
      })
    );
  }
}

/**
 * 扩展停用时的入口函数，目前为空，可根据需要添加逻辑。
 */
export function deactivate() {}
