// custom
const {getDistinct, findLowerBounds} = require('./common.code-gen');

const SPACE_2 = "  ";

/**
 * returns typescript indentation for given level
 * @param {number} level 
 * @returns 
*/
const indent = (level = 1) => {
  return new Array(level).fill(SPACE_2).join('');
};

const wCredits = os => {
  os += "/* Code generated with Crypt Arithmetic Code Generator */\n\n";
  return os;
};

const wAreDistinctFunction = os => {
  os += `/**
  * Accepts n arguments and returns true
  * if they are distinct else returns false\n*/\n`;
  os += `const are_distinct = (...args: Array<number>): boolean => {\n`;
  os += `${indent()}return args.length === (new Set(args)).size;\n`;
  os += '}\n';
  os += "\n";
  return os;
};

/**
 * returns a string representing in number
 * @param {string} word 
 * @returns {string} string
 */
const summedUpString = word => {
  let n = word.length;
  result = [...word].map((v, i) => `(${10 ** (n - i - 1)} * ${v})`);
  return result.join(" + ");
};

const wSolveFunction = (os, limits, inputs) => {
  // writing docstring
  os += `/**
  * Prints the solution with no. of
  * iterations if the solution exists\n*/\n`;
  os += "const solve = (): void => {\n";
  os += `${indent()}let iterations: number = 0;\n`;
  // writing loops
  const letters = Object.keys(limits);
  const totalLetters = letters.length;
  // for 1st letter
  let letter = letters[0];
  let lb = limits[letter];
  os += `${indent()}for (let ${letter}: number = ${lb}; ${letter} < 10; ${letter} += 1) {\n`;
  // for 2nd to n-1th letter
  for (let idx = 1; idx < totalLetters - 1; idx += 1) {
    letter = letters[idx];
    lb = limits[letter];
    os += `${indent(idx + 1)}for (let ${letter}: number = ${lb}; ${letter} < 10; ${letter} += 1) {\n`;
    let backLetters = letters.slice(0, idx + 1).join(', ');
    os += `${indent(idx + 2)}if (!are_distinct(${backLetters})) continue;\n`;
  }
  // for last letter
  let idx = totalLetters - 1;
  letter = letters[idx];
  lb = limits[letter];
  // last loop
  os += `${indent(idx + 1)}for (let ${letter}: number = ${lb}; ${letter} < 10; ${letter} += 1) {\n`;
  idx += 1;
  os += `${indent(idx + 1)}iterations += 1;\n`;
  // when letters are distinct
  os += `${indent(idx + 1)}if (are_distinct(${letters.join(', ')})) {\n`;
  idx += 1;
  // summing up the letters
  for (let word of inputs)
    os += `${indent(idx + 1)}const ${word}: number = ${summedUpString(word)};\n`;
  // checking with if statement
  os += `${indent(idx + 1)}if (${inputs[0]} + ${inputs[1]} == ${inputs[2]}) {\n`;
  idx += 1;
  // printing the solution
  os += `${indent(idx + 1)}console.log("\\n${inputs[0]} + ${inputs[1]} = ${inputs[2]}");\n`;
  const formatter = "%ld + %ld = %ld\\n";
  os += `${indent(idx + 1)}console.log(\`\${${inputs[0]}} + \${${inputs[1]}} = \${${inputs[2]}}\`);\n`;
  os += `${indent(idx + 1)}console.log(\`Iterations: \${iterations}\`);\n`;
  os += `${indent(idx + 1)}return;\n`;
  // closing loops
  while (idx) {
    idx -= 1;
    os += `${indent(idx + 1)}}\n`;
  }
  // function end
  os += `${indent()}console.log("No solution available");\n`;
  os += `}\n`;
  os += '\n';
  return os;
};

const wMainFunction = os => {
  os += `const main = (): void => {\n`;
  os += `${indent()}// starting time\n`;
  os += `${indent()}const start: number = Date.now();\n`;
  os += `${indent()}// calling the solve function\n`;
  os += `${indent()}solve();\n`;
  os += `${indent()}// total time\n`;
  os += `${indent()}const total_time: number = (Date.now() - start)/1000;\n`;
  os += `${indent()}console.log(\`Time: \${total_time.toPrecision(3)} seconds\`);\n`;
  os += `}\n\n`;
  // calling main function
  os += `main();\n\n`;
  return os;
};

/**
 * function that generates typescript code
 * for the given crypt arithmetic input
 * @param {string} addend 
 * @param {string} augend 
 * @param {string} sum 
 * @returns 
*/
const tsCodeGen = (addend, augend, sum) => {
  const startTime = Date.now();
  // finding distinct letters
  const distinct_letters = getDistinct(addend + augend + sum);
  // more than 10 distinct letters
  if (distinct_letters.length > 10) return false;
  // calculating the lower bounds
  const lowerBounds = findLowerBounds(distinct_letters, [addend[0], augend[0], sum[0]]);
  // output string
  let outputString = '';
  // writing credits
  outputString = wCredits(outputString);
  // writing are_distinct function to the file
  outputString = wAreDistinctFunction(outputString);
  // writing the solve function to the file
  outputString = wSolveFunction(outputString, lowerBounds, [addend, augend, sum]);
  // writing the main function to the file
  outputString = wMainFunction(outputString);
  // writing credits
  outputString = wCredits(outputString);
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  return {code: outputString, time: totalTime};
};

module.exports = tsCodeGen;