import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import cors from 'cors';
import root from './root';

const PORT = 8000;
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

const app = express();
app.use(httpLogger);
app.use(express.json());
app.use(cors());

app.use("/", root);

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}...`);
});
