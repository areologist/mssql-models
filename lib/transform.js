const camelCase = require('lodash/camelCase');
const mapKeys = require('lodash/mapKeys');
const find = require('lodash/find');
const isArray = require('lodash/isArray');
const uniq = require('lodash/uniq');

const jsTypeMap = {
  Bit: 'boolean',
  TinyInt: 'number',
  SmallInt: 'number',
  Int: 'number',
  BigInt: 'string',
  Numeric: 'number',
  Decimal: 'number',
  SmallMoney: 'number',
  Money: 'number',
  Float: 'number',
  Real: 'number',
  SmallDateTime: 'Date',
  DateTime: 'Date',
  DateTime2: 'Date',
  DateTimeOffset: 'Date',
  Time: 'Date',
  Date: 'Date',
  Char: 'string',
  VarChar: 'string',
  Text: 'string',
  NChar: 'string',
  NVarChar: 'string',
  NText: 'string',
  Binary: 'Buffer',
  VarBinary: 'Buffer',
  Image: 'Buffer',
  Null: 'null',
  TVP: 'object',
  UDT: 'Buffer',
  UniqueIdentifier: 'string',
  Variant: 'object',
  xml: 'string'
};

const getTypeNames = dbType => {
  const dbTypeUc = dbType.toUpperCase();
  const sqlType = Object.keys(jsTypeMap).find(key => key.toUpperCase() === dbTypeUc);
  const jsType = jsTypeMap[sqlType];
  return [sqlType, jsType];
};

const toCamelCase = data =>
  isArray(data) ?
    data.map(d => mapKeys(d, (value, key) => camelCase(key))) :
    mapKeys(data, (value, key) => camelCase(key));

const removeNullFields = obj =>
  Object.keys(obj)
    .filter(k => obj[k] !== null)
    .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});

const toParamType = (sqlType, nativeType) => {
  if (nativeType.characterMaximumLength) {
    return `${sqlType}(${nativeType.characterMaximumLength})`;
  }
  if (nativeType.numericPrecision) {
    return `${sqlType}(${nativeType.numericPrecision})`;
  }
  return sqlType;
};

const mapColumn = rawRow => {
  const row = toCamelCase(rawRow);
  const [sqlType, jsType] = getTypeNames(row.dataType);
  const nativeType = removeNullFields(row);
  const nullable = row.isNullable === 'YES';
  const paramType = toParamType(sqlType, nativeType);
  return {
    name: camelCase(row.columnName),
    ordinal: row.ordinalPosition,
    nativeType,
    sqlType,
    jsType,
    paramType,
    nullable,
  };
};

const mapTable = rawRow => {
  const row = toCamelCase(rawRow);
  return {
    name: row.tableName,
    schema: row.tableSchema,
  };
};

const mapKey = rawRow => {
  const row = toCamelCase(rawRow);
  return {
    column: camelCase(row.columnName),
    schema: row.tableSchema,
    table: row.tableName,
    name: row.constraintName,
    nativeColumn: row.columnName
  };
};

const buildContext = (tables, columns, keys) => {
  const mappedColumns = columns.map(mapColumn);
  const mappedKeys = keys.map(mapKey);
  const isPrimaryKey = (col, keys) => !!find(keys, k => k.column === col.name);
  return tables
    .map(mapTable)
    .map(t => ({
      ...t,
      keys: mappedKeys.filter(k => k.table === t.name),
      columns: mappedColumns.filter(c => c.nativeType.tableName === t.name)
    }))
    .map(t => ({
      ...t,
      sqlTypes: uniq(t.columns.map(c => c.sqlType)),
      columns: t.columns.map(c => isPrimaryKey(c, t.keys) ? ({ ...c, primaryKey: true }) : c)
    }));
};

module.exports = {
  jsTypeMap,
  toCamelCase,
  getTypeNames,
  mapColumn,
  mapTable,
  buildContext,
};
