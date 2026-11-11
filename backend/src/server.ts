import { createApp } from './app.js';

const port = Number.parseInt(process.env.PORT ?? '4000', 10);
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error('PORT must be an integer from 1 to 65535');
}

const app = createApp();
app.listen(port, '127.0.0.1', () => {
  console.log('DevCollab API is listening at http://localhost:' + port);
});
