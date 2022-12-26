/** 
 * @param {string} line
*/
exports.isFunctionDefinition = (line) => {
  return /function\s+\w+\s*\(/.test(line) || /\w+\s*=\s*function\s*\(/.test(line) || /(\w*|\s*)=\s*\(.*\)\s*=>\s*\{/.test(line);
};

/** 
 * @param {string} line
*/
exports.isFunctionWithParams = (line) => {
  return !(/function\s+\w+\s*\(\s*\)/.test(line) || /\w+\s*=\s*function\s*\(\s*\)/.test(line) || /(\w*|\s*)=\s*\(s*\)\s*=>\s*\{/.test(line));
}

/** 
 * @param {string} line
*/
exports.getFunctionName = (line) => {
  return line.match(/function\s+(\w+)\s*\(/)?.[1] || line.match(/(\w+)\s*=\s*function\s*\(/)?.[1] || line.match(/(\w+)\s*=\s*\(.*\)\s*=>\s*\{/)?.[1];
};

/** 
 * @param {string} code
 * @param {string} functionName
 * @param {string} params
*/
exports.callTimedFunction = (code, functionName, params) => {
  code += `\n
    const { performance } = require('perf_hooks') \n
    const start = performance.now() \n
    const result = ${functionName}(${params}) \n
    const end = performance.now() \n;
    console.log(\`\nExecution time: \${end - start}ms\`) \n;
    console.log(\`Return value:\`, result) \n;
  `;
  return code;
};