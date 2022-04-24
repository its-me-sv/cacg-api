/**
 * returns the distinct letters as a string
 * @param {string} str 
 * @returns {string} string
 */
const getDistinct = str => {
  return [...(new Set(str))].join('');
};

/**
 * returns lower bound of each letter
 * @param {string} distinct_letters 
 * @param {Array<string>} first_letters 
 * @returns {{[key: string]: number}} object
*/
const findLowerBounds = (distinct_letters, first_letters) => {
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
