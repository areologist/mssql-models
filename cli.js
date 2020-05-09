#!/usr/bin/env node

const meow = require('meow');

const helpString = `
	Usage
	  $ modelgen <flags>

	Options
    --server, -s      The sql server name
    --database, -d    The sql server database name
    --user, -u        The sql server user id
    --password, -p    The sql server password
    --output, -o      Output directory for generated models
    --template, -t    Path to custom template for model output

	Examples
	  $ modelgen -s localhost -d MySqlDb -u sa -p meowmeow
`;

const flags = {
  server: {
    type: 'string',
    alias: 's',
    isRequired: () => true
  },
  database: {
    type: 'string',
    alias: 'd',
    isRequired: () => true
  },
  user: {
    type: 'string',
    alias: 'u',
    isRequired: () => true
  },
  password: {
    type: 'string',
    alias: 'p',
    isRequired: () => true
  },
  output: {
    type: 'string',
    alias: 'o'
  },
  template: {
    type: 'string',
    alias: 't'
  },
};

const cli = meow(helpString, { flags });

const main = require('./lib/main');

(async () => {
  await main(cli.input[0], cli.flags);
})();
