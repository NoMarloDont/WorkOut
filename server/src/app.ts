import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import cors from 'cors';

const PORT = 8000;
const app = express();
const logger = pino();

const httpLogger = pinoHttp({
  logger,
  customLogLevel: function (res, err) {
    if (res.statusCode >= 400 || err) {
      return 'error';
    }
    return 'info';
  },
});

app.use(httpLogger);
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}...`);
});
