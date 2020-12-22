import express, {Request, Response} from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import cors from 'cors';
import {EmptyGetRequestBody, LoginRequestBody, LoginResponseBody} from './types';
import {OAuth2Client} from 'google-auth-library';
import bodyParser from 'body-parser';
import e from 'express';

const PORT = 8000;
const app = express();
const logger = pino();
const CLIENT_ID = '812267761968-lvohpt9e9uiudh8s0r9s8n6gciqjqrr5.apps.googleusercontent.com';

// Stuff
// sub id to user id
const subToUserIds: Map<string, number> = new Map();
// id token to sub map
const idTokenToSub: Map<string, string> = new Map();
// access_token to id token map
const accessTokenToIdToken: Map<string, string> = new Map();

// access token for authorization
// id token for authentication
// sub map to database id

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

app.post(
  '/auth',
  async (
    req: Request<{}, LoginResponseBody, LoginRequestBody>,
    res: Response<LoginResponseBody>,
  ) => {
    const client: OAuth2Client = new OAuth2Client(CLIENT_ID);
    const {idToken, accessToken} = req.body;

    try {
      await verify(client, idToken);
      accessTokenToIdToken.set(accessToken, idToken);
      res.send(200);
    } catch (error) {
      logger.error(error);
      res.send(401);
    }
  },
);

app.get('/sub', (req: Request<{}, string, {authorization: string}>, res: Response<any>) => {
  const accessToken = req.body.authorization;
  const idToken = accessTokenToIdToken.get(accessToken);

  if (!idToken) {
    res.send(401);
  } else {
    const sub = idTokenToSub.get(idToken);

    if (sub) {
      res.send(sub);
    } else {
      res.send(401);
    }
  }
});

async function verify(client: OAuth2Client, idToken: string): Promise<void> {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (payload) {
    const {size} = subToUserIds;
    subToUserIds.set(payload['sub'], size);
    idTokenToSub.set(idToken, payload['sub']);
  } else {
    throw new Error('Was unable to verify auth payload with Google Server');
  }
}

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}...`);
});
