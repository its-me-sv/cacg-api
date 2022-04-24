// custom
const {getDistinct, findLowerBounds} = require('./common.code-gen');

const SPACE_4 = "    ";

/**
 * returns python indentation for given level
 * @param {number} level 
 * @returns 
 */
const indent = (level = 1) => {
  return new Array(level).fill(SPACE_4).join('');
} ;

const wCredits = os => {
  os += "'''Code generated with Crypt Arithmetic Code Generator'''\n";
  return os;
};

const wTimeHeader = os => {
  os += "from time import time\n";
  os += "\n";
  return os;
};

const wAreDistinctFunction = os => {
  os += "def are_distinct(*args) -> bool:\n";
  os += `${indent()}'''\n`;
  os += `${indent(2)}Accepts n arguments and returns true\n`;
  os += `${indent(2)}if they are distinct else returns false\n`;
  os += `${indent()}'''\n`;
  os += `${indent()}return len(args) == len(set(args))\n`;
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
  os += "def solve() -> None:\n";
  // writing docstring
  os += `${indent()}'''\n`;
  os += `${indent(2)}Prints the solution with no. of\n`;
  os += `${indent(2)}iterations if the solution exists\n`;
  os += `${indent()}'''\n`;
  os += `${indent()}iterations = 0\n`;
  // writing loops
  const letters = Object.keys(limits);
  const totalLetters = letters.length;
  // for 1st letter
  os += `${indent()}for ${letters[0]} in range(${limits[letters[0]]}, 10):\n`;
  // for 2nd to n-1th letter
  for (let idx = 1; idx < totalLetters - 1; idx += 1) {
    let letter = letters[idx];
    let lb = limits[letter];
    os += `${indent(idx + 1)}for ${letter} in range(${lb}, 10):\n`;
    os += `${indent(idx + 2)}if not are_distinct(${letters.slice(0, idx + 1).join(', ')}): continue\n`;
  }
  // for last letter
  let idx = totalLetters - 1;
  let letter = letters[idx];
  let lb = limits[letter];
  // last loop
  os += `${indent(idx + 1)}for ${letter} in range(${lb}, 10):\n`;
  idx += 1;
  os += `${indent(idx + 1)}iterations += 1\n`;
  // when letters are distinct
  os += `${indent(idx + 1)}if are_distinct(${letters.join(', ')}):\n`;
  idx += 1;
  // summing up the letters
  for (let word of inputs) 
    os += `${indent(idx + 1)}${word} = ${summedUpString(word)}\n`;
  // checking with if statement
  os += `${indent(idx + 1)}if ${inputs[0]} + ${inputs[1]} == ${inputs[2]}:\n`;
  idx += 1;
  // printing the solution
  os += `${indent(idx + 1)}print("\\n${inputs[0]} + ${inputs[1]} = ${inputs[2]}")\n`;
  const formatter = "{} + {} = {}";
  os += `${indent(idx + 1)}print("${formatter}".format(${inputs[0]}, ${inputs[1]}, ${inputs[2]}))\n`;
  os += `${indent(idx + 1)}print("Iterations:", iterations)\n`;
  os += `${indent(idx + 1)}return\n`;
  os += `${indent()}print("\\nNo solution available")\n`;
  os += '\n';
  return os;
};

const wMainFunction = os => {
  // checking main file condition
  os += "if __name__ == '__main__':\n";
  // adding starter
  os += `${indent()}# starting time\n`;
  os += `${indent()}start = time()\n`;
  // calling solve function
  os += `${indent()}# Calling the solve function\n`;
  os += `${indent()}solve()\n`;
  // adding total time
  os += `${indent()}# total time\n`;
  os += `${indent()}total_time = round(time() - start, 3)\n`;
  // printing total time
  os += `${indent()}print("Time: ${'{}'} seconds".format(total_time))\n`;
  os += "\n";
  return os;
};

/**
 * function that generates python code
 * for the given crypt arithmetic input
 * @param {string} addend 
 * @param {string} augend 
 * @param {string} sum 
 * @returns 
 */
const pythonCodeGen = (addend, augend, sum) => {
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
  outputString = wTimeHeader(outputString);
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

module.exports = pythonCodeGen;