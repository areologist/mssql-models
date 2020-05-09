const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const logger = require('./logger');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const saveText = async (text, filename, directory) => {
  try {
    const outputPath = path.resolve(directory || __dirname, filename || 'output.txt');
    await writeFileAsync(outputPath, text);
    logger.info(`File created at ${outputPath}`);
  } catch (err) {
    logger.error(err);
  }
};

const saveJson = async (data, filename, directory) =>
  saveText(JSON.stringify(data, null, 2), filename || 'output.json', directory);

const loadTemplate = async filename => {
  try {
    const templatePath = path.resolve('./templates', filename);
    const buffer = await readFileAsync(templatePath);
    return buffer.toString('utf8');
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  saveText,
  saveJson,
  loadTemplate,
};
