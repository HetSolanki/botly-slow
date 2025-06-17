import activateBotly from "./utils/activateBolty.js";
import * as vscode from "vscode";
import { getContentHtml } from "./utils/getContentHtml.js";
import { spawn } from "node:child_process";
import path from "node:path";

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) { 
  console.log('Congratulations, your extension "balty" is now active!');

  const disposable = vscode.commands.registerCommand(
    "botly.ask",
    activateBotly
  );

  const webView = vscode.commands.registerCommand("botly.openChat", () => {
    const panel = vscode.window.createWebviewPanel(
      "botly",
      "maybe helpful",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );

    panel.webview.html = getContentHtml();
    const extensionPath =
      vscode.extensions.getExtension("hets.botly")?.extensionPath;
    const pythonPath = path.join(
      extensionPath,
      "botly-(agent)",
      "venv",
      "Scripts",
      "python"
    );
    const scriptPath = path.join(extensionPath, "botly-(agent)", "main.py");

    const agent = spawn(pythonPath, [scriptPath]);

    panel.webview.onDidReceiveMessage((msg) => {
      activateBotly(agent, msg.text)
        .then((response) => {
          console.log(response);
          panel.webview.postMessage({ type: "model", text: response });
        })  
        .catch((err) => {
          console.log(err);
        });
    });
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(webView);
}

export function deactivate() {}
