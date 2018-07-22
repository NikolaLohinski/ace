import ArgParser from 'argparce';
import Express from 'express';
import Routes from './routes';
import Errors from './errors';
import Parser from './parser';

const args = ArgParser.parse(process.argv.slice(2), { args: [
  { type: 'uinteger', name: 'port', short: 'p' },
  { type: 'boolean', name: 'no-logging' }
] }).args;

const API = Express();
API.use(Express.json());

Parser(API);
Routes(API, args['no-logging']);
Errors(API);

API.listen(args['port'], () => {
  console.log(`API up and running at http://localhost:${args['port']}`);
});
