import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export async function create_file(relativePath, content) {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  console.log("Workspace", workspaceFolders);
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace folder is open.");
    return;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  console.log("root", workspaceRoot);

  const filePath = path.join(workspaceRoot, relativePath);
  console.log("filePath", filePath);

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Write the file (will create it if it doesn't exist)
  fs.writeFileSync(filePath, content);
}
