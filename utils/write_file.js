import * as vscode from "vscode";
import * as path from "path";

export async function write_file(content, file_path = "") {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const fullRange = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(editor.document.getText().length)
    );

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, content);
    });

    return JSON.stringify({
      type: "write-file-response",
      function_name: "write_file",
      content: "Write Operation Done Succesfully",
      status: "done",
    });
  } else {
    try {
      const workspace = vscode.workspace.workspaceFolders;
      const workspaceRoot = workspace[0].uri.fsPath;
      const filePath = path.join(workspaceRoot, file_path);

      // Open the file as a text document
      const document = await vscode.workspace.openTextDocument(filePath);

      // Replace the entire content
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );

      await editor.edit((editBuilder) => {
        editBuilder.replace(fullRange, content);
      });

      return JSON.stringify({
        type: "write-file-response",
        function_name: "write_file",
        content: "Write Operation Done Succesfully",
        status: "done",
      });
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to open or modify file: ${err}`);
    }
  }
}
