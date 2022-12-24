const vscode = require('vscode');

module.exports = () => {
    return vscode.commands.registerCommand('timekeeper.probe', () => {
        vscode.window.showInformationMessage('Timekeeper eyes wide awake!');
    });
}