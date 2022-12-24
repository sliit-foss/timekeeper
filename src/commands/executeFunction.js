const vscode = require('vscode');

module.exports = () => {
    return vscode.commands.registerCommand('timekeeper.executeFunction', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return; // No open text editor
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        console.log(text);
        vscode.window.showInformationMessage(text);
    });
}