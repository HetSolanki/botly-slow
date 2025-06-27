import activateBotly from "./utils/activateBolty.js";
import * as vscode from "vscode";
import { spawn } from "node:child_process";
import path from "node:path";
import { getWebviewContent } from "./utils/getWebviewContent.js";

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
  console.log('Congratulations, your extension "bitwise" is now active!');

  const disposable = vscode.commands.registerCommand(
    "bitwise.ask",
    activateBotly
  );

  const webView = vscode.commands.registerCommand("bitwise.openChat", () => {
    const panel = vscode.window.createWebviewPanel(
      "bitwise",
      "maybe helpful",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );

    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

    const extensionPath =
      vscode.extensions.getExtension("hets.bitwise")?.extensionPath;
    const pythonPath = path.join(
      extensionPath,
      "bitwise",
      "venv",
      "Scripts",
      "python"
    );

    const scriptPath = path.join(extensionPath, "bitwise", "main.py");

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
