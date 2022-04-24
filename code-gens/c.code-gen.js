// custom
const {getDistinct, findLowerBounds} = require('./common.code-gen');

const SPACE_2 = "  ";

/**
 * returns c indentation for given level
 * @param {number} level 
 * @returns 
*/
const indent = (level = 1) => {
  return new Array(level).fill(SPACE_2).join('');
};

const wCredits = os => {
  os += "/* Code generated with Crypt Arithmetic Code Generator */\n";
  return os;
};

const wHeader = os => {
  os += '#include <time.h>\n';
  os += '#include <stdarg.h>\n';
  os += '#include <stdio.h>\n';
  os += '\n';
  return os;
};

const wAreDistinctFunction = os => {
  os += `int are_distinct(int n, ...) {\n`;
  os += `${indent()}/*\n`;
  os += `${indent(2)}Accepts n arguments and returns 1\n`;
  os += `${indent(2)}if they are distinct else returns 0\n`;
  os += `${indent()}*/\n`;
  os += `${indent()}int memo[10] = {0};\n`;
  os += `${indent()}va_list args;\n`;
  os += `${indent()}va_start(args, n);\n`;
  os += `${indent()}for (int i = 0; i < n; i += 1) {\n`;
  os += `${indent(2)}int no = va_arg(args, int);\n`;
  os += `${indent(2)}if (memo[no]) return 0;\n`;
  os += `${indent(2)}memo[no] = 1;\n`;
  os += `${indent()}}\n`;
  os += `${indent()}return 1;\n`;
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
  os += "int solve() {\n";
  // writing docstring
  os += `${indent()}/*\n`;
  os += `${indent(2)}Prints the solution with no. of\n`;
  os += `${indent(2)}iterations if the solution exists\n`;
  os += `${indent()}*/\n`;
  os += `${indent()}unsigned long int iterations = 0;\n`;
  // writing loops
  const letters = Object.keys(limits);
  const totalLetters = letters.length;
  // for 1st letter
  let letter = letters[0];
  let lb = limits[letter];
  os += `${indent()}for (int ${letter} = ${lb}; ${letter} < 10; ${letter} += 1) {\n`;
  // for 2nd to n-1th letter
  for (let idx = 1; idx < totalLetters - 1; idx += 1) {
    letter = letters[idx];
    lb = limits[letter];
    os += `${indent(idx + 1)}for (int ${letter} = ${lb}; ${letter} < 10; ${letter} += 1) {\n`;
    let backLetters = letters.slice(0, idx + 1).join(', ');
    os += `${indent(idx + 2)}if (!are_distinct(${idx + 1}, ${backLetters})) continue;\n`;
  }
  // for last letter
  let idx = totalLetters - 1;
  letter = letters[idx];
  lb = limits[letter];
  // last loop
  os += `${indent(idx + 1)}for (int ${letter} = ${lb}; ${letter} < 10; ${letter} += 1) {\n`;
  idx += 1;
  os += `${indent(idx + 1)}iterations += 1;\n`;
  // when letters are distinct
  os += `${indent(idx + 1)}if (are_distinct(${totalLetters}, ${letters.join(', ')})) {\n`;
  idx += 1;
  // summing up the letters
  for (let word of inputs)
    os += `${indent(idx + 1)}long int ${word} = ${summedUpString(word)};\n`;
  // checking with if statement
  os += `${indent(idx + 1)}if (${inputs[0]} + ${inputs[1]} == ${inputs[2]}) {\n`;
  idx += 1;
  // printing the solution
  os += `${indent(idx + 1)}printf("\\n${inputs[0]} + ${inputs[1]} = ${inputs[2]}\\n");\n`;
  const formatter = "%ld + %ld = %ld\\n";
  os += `${indent(idx + 1)}printf("${formatter}",${inputs[0]}, ${inputs[1]}, ${inputs[2]});\n`;
  os += `${indent(idx + 1)}printf("Iterations: %lu\\n", iterations);\n`;
  os += `${indent(idx + 1)}return 1;\n`;
  // closing loops
  while (idx) {
    idx -= 1;
    os += `${indent(idx + 1)}}\n`;
  }
  // function end
  os += `${indent()}printf("No solution available\\n");\n`;
  os += `${indent()}return 0;\n`;
  os += `}\n`;
  os += '\n';
  return os;
};

const wMainFunction = os => {
  os += `int main() {\n`;
  os += `${indent()}// starting time\n`;
  os += `${indent()}time_t start;\n`;
  os += `${indent()}time(&start);\n`;
  os += `${indent()}// calling the solve function\n`;
  os += `${indent()}solve();\n`;
  os += `${indent()}// total time\n`;
  os += `${indent()}time_t finish;\n`;
  os += `${indent()}time(&finish);\n`;
  os += `${indent()}double diff = difftime(finish, start);\n`;
  os += `${indent()}printf("Time: %.3f seconds\\n", diff);\n`;
  os += `${indent()}return 0;\n`;
  os += `}\n`;
  os += '\n';
  return os;
};

/**
 * function that generates c code
 * for the given crypt arithmetic input
 * @param {string} addend 
 * @param {string} augend 
 * @param {string} sum 
 * @returns 
*/
const cCodeGen = (addend, augend, sum) => {
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
  // writing headers
  outputString = wHeader(outputString);
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

module.exports = cCodeGen;