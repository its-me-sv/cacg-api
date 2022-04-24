// custom
const {getDistinct, findLowerBounds} = require('./common.code-gen');

const jsCodeGen = (addend, augend, sum) => {
  const startTime = Date.now();
  // finding distinct letters
  const distinct_letters = getDistinct(addend + augend + sum);
  // more than 10 distinct letters
  if (distinct_letters.length > 10) return false;
  // calculating the lower bounds
  const lowerBounds = findLowerBounds(distinct_letters, [addend[0], augend[0], sum[0]]);
  // output string
  let outputString = '';
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  return {code: outputString, time: totalTime};
};

module.exports = jsCodeGen;