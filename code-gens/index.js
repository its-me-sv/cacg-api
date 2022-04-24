// custom 
const cCodeGen = require('./c.code-gen');
const cppCodeGen = require('./cpp.code-gen');
const pythonCodeGen = require('./python.code-gen');
const jsCodeGen = require('./js.code-gen');
const tsCodeGen = require('./ts.code-gen');

const codeGenerator = [
  cCodeGen, cppCodeGen,
  pythonCodeGen,
  jsCodeGen, tsCodeGen
];

module.exports = codeGenerator;
