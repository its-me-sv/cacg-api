const cCodeGen = (addend, augend, sum) => {
  const startTime = Date.now();
  // output string
  let outputString = '';
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  return {code: outputString, time: totalTime};
};

module.exports = cCodeGen;