import * as vscode from "vscode";

export function get_current_file_path() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const filePath = editor.document.uri.fsPath.split("\\");
    const path = filePath
      .filter((file) => file.split(".").length == 1)
      .join("\\");
    console.log("Path-", path);
    return JSON.stringify({
      type: "file-path",
      function_name: "get_current_file_path",
      content: path,
      status: "Current file path fetched",
    });
  } else {
    console.log("No any files are selected..!");
  }
}
