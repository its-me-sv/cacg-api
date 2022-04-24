const getDistinct = str => {
  // returns the distinct letters as a string
  return [...(new Set(str))].join('');
};

const findLowerBounds = (distinct_letters, first_letters) => {
  // returns lower bound of each letter
  const result = [...distinct_letters].reduce((acc, val) => {
    acc[val] = Number(first_letters.includes(val));
    return acc;
  }, {});
  return result;
};

module.exports = {
  getDistinct,
  findLowerBounds
};
