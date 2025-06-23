import * as vscode from "vscode";
import * as path from "path";

export async function get_file_content(file_path) {
  const workspace = vscode.workspace.workspaceFolders;

  const workspaceRoot = workspace[0].uri.fsPath;

  const filePath = path.join(workspaceRoot, file_path);

  // Open the file as a text document
  const document = await vscode.workspace.openTextDocument(filePath);

  const content = document.getText();
  return content;
}
