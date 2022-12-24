const vscode = require('vscode');
const commands = require('./commands');

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
	console.log('Congratulations, your extension "Timekeeper" is now active!');
	commands.forEach(command => {
		const disposable = command();
		context.subscriptions.push(disposable);
	});
}

const deactivate = () => {

}

module.exports = {
	activate,
	deactivate
}
