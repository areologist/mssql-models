# mssql-models

Quick one-off tool for generating TypeScript code from SQL Server DB for use with `node-mssql`. Ironically written in JavaScript.

## Usage

```sh
Usage:
  modelgen [options]

Options:
  -s, --server             the sql server name
  -d, --database           the database name
  -u, --user               sql login uid
  -p, --password           sql login pwd
  -h, --help               display help for command
```

### Example

```sh
# Create models
modelgen -s localhost -u sa -d My_Database -p mypassword
```

## Details

Currently applies the template at `templates/entity-base.ts.tmpl` for each table in the database, passing it the following `Context` data structure.

Files are saved to `./output`. Create this directory before using.

```typescript
interface Context {
  table: TableInfo;
  columns: ColumnInfo[];
}

interface TableInfo {
  name: string;
  schema: string;
  keys: KeyInfo[];
}

interface KeyInfo {
  column: string;
  schema: string;
  table: string;
  name: string;
  nativeColumn: string;
}

interface ColumnInfo {
  name: string;
  ordinal: number;
  nativeType: {
    tableCatalog: string;
    tableSchema: string;
    tableName: string;
    columnName: string;
    ordinalPosition: string;
    isNullable: string;
    dataType: string;
    numericPrecision: number;
    numericPrecisionRadix: number;
    numericScale: number;
  };
  sqlType: string;
  jsType: string;
  paramType: string;
  nullable: boolean;
  primaryKey: boolean;
}
```

For example:

```json
{
  "table": {
    "name": "MyTable",
    "schema": "dbo",
    "keys": [
      {
        "column": "rowId",
        "schema": "dbo",
        "table": "MyTable",
        "name": "PK_MyTable",
        "nativeColumn": "row_id"
      }
    ]
  },
  "columns": [
      {
        "name": "row_id",
        "ordinal": 1,
        "nativeType": {
          "tableCatalog": "MyDatabase",
          "tableSchema": "dbo",
          "tableName": "MyTable",
          "columnName": "row_id",
          "ordinalPosition": 1,
          "isNullable": "NO",
          "dataType": "int",
          "numericPrecision": 10,
          "numericPrecisionRadix": 10,
          "numericScale": 0
        },
        "sqlType": "Int",
        "jsType": "number",
        "paramType": "Int(10)",
        "nullable": false,
        "primaryKey": true
      },
      // ... additional columns
```


### Example output

Current template will produce files like the following, for each table in the DB. Modify the template to suit your needs.

> For my project, I created an entity base class and a streamlined querying abstraction layer on top of `mssql`.
> I quickly wrote this utility so I could update the models with a single command when the DB changes.
> Was able to rapidly create GraphQL resolvers (just as well REST endpoints) with feedback from TypeScript if DB schema changed.

```typescript
import { Int, NVarChar, Bit } from 'mssql';

import EntityBase from './EntityBase';

export interface Contacts {
  contactId: number;
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  disabled?: boolean;
}

export default class ContactsEntity extends EntityBase<Contacts> {
  constructor() {
    super('Contacts', {
      contactId: Int(10),
      firstName: NVarChar(80),
      lastName: NVarChar(80),
      title: NVarChar(80),
      email: NVarChar(80),
      phone: NVarChar(80),
      disabled: Bit
    }, ['contactId']);
  }
}
```

## TO-DO

* Argument for specifying output directory
* Create output directory if doesn't exist
* Argument for specifying template path
* Convention for name and extension of output files. For example, if a template is called `my-template.ts.tmpl`, the output files will be called `{table-name}.ts`.
* Ability to specify list of tables to include or exclude
* Support for multiple templates
* Support for outputing db info to json file
* Streamlined argument for specifying Sql Server connection info
* Add more info to the context object
* Possibly publish my related mini-ORM to Github

For example, could look something like this:

```sh
modelgen user:pass@localhost:3306/my-database -o ./models -t ./templates/my-template.ts.tmpl
```
