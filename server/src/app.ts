import express, {Request, Response} from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import cors from 'cors';
import {LoginRequestBody, LoginResponseBody} from './types';
import {OAuth2Client} from 'google-auth-library';
import bodyParser from 'body-parser';

const PORT = 8000;
const app = express();
const logger = pino();
const CLIENT_ID = '812267761968-lvohpt9e9uiudh8s0r9s8n6gciqjqrr5.apps.googleusercontent.com';

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

const jsonParser = bodyParser.json();
app.use(jsonParser);

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

const userIds: {[userId: string]: string} = {};

app.post(
  '/auth',
  async (
    req: Request<{}, LoginResponseBody, LoginRequestBody>,
    res: Response<LoginResponseBody>,
  ) => {
    console.log(req);
    const client: OAuth2Client = new OAuth2Client(CLIENT_ID);

    try {
      // check if userId already exists // create if necessary
      await verify(client, req.body.idToken);
      res.send(200);
    } catch (error) {
      logger.error(error);
      res.send(401);
    }
  },
);

async function verify(client: OAuth2Client, idToken: string): Promise<void> {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (payload) {
    const {length} = userIds;
    userIds[length] = payload['sub'];
  }
}

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}...`);
});
