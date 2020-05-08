# mssql-models

Generates JavaScript or TypeScript code for use with `node-mssql` based on database schema.

Code generated based on template.

## Usage

```sh
Usage:
  modelgen [options]

Options:
  -c, --connection         the mssql connection string
  -d, --debug              output extra debugging
  -s, --small              small pizza size
  -p, --pizza-type <type>  flavour of pizza
  -h, --help               display help for command
```

### Examples

```sh
# Create models
modelgen -c root:pass@localhost:3306 -d my-db -o models
```
