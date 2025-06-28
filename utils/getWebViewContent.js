import path from "path";
import { Uri } from "vscode";

/**
 * @param {import('vscode').Webview} webview
 * @param {import('vscode').Uri} extensionUri
 * @returns {string}
 */
export function getWebviewContent(webview, extensionUri) {
  const scriptUri = webview.asWebviewUri(
    Uri.joinPath(extensionUri, "media", "assets", "index.js")
  );

  const styleUri = webview.asWebviewUri(
    Uri.joinPath(extensionUri, "media", "assets", "index.css")
  );

  const nonce = getNonce();

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="${styleUri}">
        <title>Bitwise</title>
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
      </body>
      </html>
    `;
}

function getNonce() {
  return [...Array(16)].map(() => Math.random().toString(36)[2]).join("");
}
