const vscode = require('vscode');
const exec = require("actions-exec-wrapper").default;
const { isFunctionDefinition, isFunctionWithParams, getFunctionName, callTimedFunction } = require('../utils');

const { Range, Position, Uri } = vscode;

module.exports = () => {
    return vscode.commands.registerCommand('timekeeper.executeFunction', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return; // No open text editor
        const currentLine = editor.document.lineAt(editor.selection.active.line).text;
        if (!isFunctionDefinition(currentLine)) {
            vscode.window.showErrorMessage('Selected line is not a function definition');
            return;
        }
        if (isFunctionWithParams(currentLine)) {
            const paramInputDialog = vscode.window.createInputBox();
            paramInputDialog.placeholder = "Enter function parameters as comma separated values";
            paramInputDialog.show()
            paramInputDialog.onDidAccept(() => {
                const params = paramInputDialog.value;
                execute(getFunctionName(currentLine), params);
                paramInputDialog.dispose();
            });
        } else {
            execute(getFunctionName(currentLine));
        }
    });
}

/** 
 * @param {string} functionName
 * @param {string} params
*/
const execute = (functionName, params = "") => {
    const editor = vscode.window.activeTextEditor;
    const fullEditorText = editor.document.getText(new Range(new Position(0, 0), new Position(editor.document.lineCount, 0)));
    const executionFilePath = `${process.cwd()}/extensions/timekeeper/temporary-execution-file.js`;
    vscode.workspace.fs.writeFile(Uri.file(executionFilePath), Buffer.from(callTimedFunction(fullEditorText, functionName, params), 'utf8'));
    exec(`node "${executionFilePath}"`).then((result) => {
        output(`\n${result}`)
    }).catch((error) => {
        output(`\nExecution Failed!\n ${error}`);
    }).finally(() => {
        vscode.workspace.fs.delete(Uri.file(executionFilePath));
    });
};

/** 
 * @param {string} text
*/
const output = (text) => {
    let terminal = vscode.window.terminals.find(terminal => terminal.name === "timekeeper");
    if (!terminal) terminal = vscode.window.createTerminal("timekeeper");
    terminal.show();
    terminal.sendText(`\"${text}\"`);
};
