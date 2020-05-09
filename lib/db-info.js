const logger = require('./logger');
const { connectionPoolGen, mssql } = require('./pool');

let _pool;

const connectionGen = config => async () => {
  if (!_pool) {
    _pool = await connectionPoolGen(config);
  }
  return _pool.request();
};

class DbInfo {
  constructor(config) {
    this.config = config;
    this.connection = connectionGen(config);
  }

  close() {
    if (_pool) _pool.close();
  }

  async tables() {
    const conn = await this.connection();
    return new Promise((resolve, reject) => {
      conn
        .query(`
          select * from information_schema.tables
          where table_catalog = '${this.config.database}'
          and table_type = 'BASE TABLE'
        `, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.recordset);
        });
    });
  }

  async columns() {
    const conn = await this.connection();
    return new Promise((resolve, reject) => {
      conn
        .query(`select * from information_schema.columns`, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.recordset);
        });
    });
  }

  async keys() {
    const conn = await this.connection();
    return new Promise((resolve, reject) => {
      conn
        .query(`
        select t.table_schema, t.table_name, tc.constraint_name, kc.column_name
        from information_schema.tables t
        left join information_schema.table_constraints tc
        on tc.table_catalog = t.table_catalog 
        and tc.table_schema = t.table_schema 
        and tc.table_name = t.table_name 
        and tc.constraint_type = 'PRIMARY KEY'
        left join information_schema.key_column_usage kc
        on kc.constraint_name = tc.constraint_name
        where t.table_type = 'BASE TABLE'`, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.recordset);
      });
    });
  }
}

module.exports = DbInfo;
