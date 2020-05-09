const mssql = require('mssql');
const logger = require('./logger');

const config = {
  user: '',
  password: '',
  server: '',
  database: '',
  options: {
    enableArithAbort: true
  }
};

const connectionPoolGen = connection => new mssql.ConnectionPool({
    ...config,
    ...connection
  })
  .connect()
  .then(pool => {
    logger.info(`Connected to mssql://${connection.user}@${connection.server}/${connection.database}`);
    return pool;
  })
  .catch(err => logger.fatal('Database connection failed.', err));

const queries = {
  tables: `select * from information_schema.tables`
};

module.exports = {
  mssql,
  connectionPoolGen
};
