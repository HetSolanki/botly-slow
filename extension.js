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
      if (msg.type == "user") {
        activateBotly(agent, msg.text)
          .then((response) => {
            try {
              response = JSON.parse(response);
              if (response.type === "model_response") {
                panel.webview.postMessage(response || "No Content");
              } else {
                console.log(response);
              }
            } catch (e) {
              console.log(e);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (msg.type == "write-file-response") {
        agent.stdin.write(
          JSON.stringify({
            type: "write-file-response",
            function_name: msg.function_name,
            content: msg.content,
          }) + "\n"
        );
      }
    });
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(webView);
}

export function deactivate() {}
