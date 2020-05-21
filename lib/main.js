const template = require('lodash/template');

const DbInfo = require('./db-info');
const logger = require('./logger');
const { loadTemplate, saveJson, saveText } = require('./fs-util');
const { buildContext } = require('./transform');

const main = async (command, args) => {
  const { server, database, user, password } = args;
  const db = new DbInfo({ server, database, user, password });

  const tables = await db.tables();
  const columns = await db.columns();
  const keys = await db.keys();
  const context = buildContext(tables, columns, keys);

  // await saveJson(context, 'context.json', './');

  const templateText = await loadTemplate('entity-base.ts.tmpl');
  // logger.debug('template: \n', templateText);
  const compiled = template(templateText);
  context.forEach(t => {
    const c = t.columns;
    const interpolated = compiled({ table: t, columns: c });
    saveText(interpolated, `${t.name}.ts`, './output');
  });

  db.close();
};

module.exports = main;
