/* eslint-env node */
import path from 'path';
import process from 'node:process';
import { fileURLToPath } from 'url';
import jsonServer from 'json-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', 'db.json');

const PORT = Number(process.env.JSON_SERVER_PORT) || 5000;
const DELAY = Number(process.env.JSON_SERVER_DELAY) || 200;

const server = jsonServer.create();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  setTimeout(next, DELAY);
});

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server running at http://localhost:${PORT} (delay ${DELAY}ms)`);
});

