const getDistinct = str => {
  return Array(...(new Set(str))).join('');
};

const findLowerBounds = (distinct_letters, first_letters) => {
  const result = [...distinct_letters].reduce((acc, val) => {
    acc[val] = Number(first_letters.includes(val));
    return acc;
  }, {});
  return result;
};

const codeGenerator = (addend, augend, sum) => {
  const distinct_letters = getDistinct(addend + augend + sum);
  if (distinct_letters.length > 10) return false;
  const lowerBounds = findLowerBounds(distinct_letters, [addend[0], augend[0], sum[0]]);
  return lowerBounds;
};

module.exports = codeGenerator;