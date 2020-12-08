import express, { Request, Response } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import cors from 'cors';
import { LoginRequestPayload } from './types';
import { OAuth2Client } from 'google-auth-library';


const PORT = 8000;
const app = express();
const logger = pino();
const CLIENT_ID = '812267761968-lvohpt9e9uiudh8s0r9s8n6gciqjqrr5.apps.googleusercontent.com';

const userIds: {[userId: string]: string} = {};

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

async function verify(client: OAuth2Client, idToken: string) {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (payload) {
    userIds['1'] = payload['sub'];
  }

  console.log(userIds);
}

// Login or Register
app.post('/login', (req: Request, res: Response) => {
  // req has idToken and accessToken
  const client: OAuth2Client = new OAuth2Client(CLIENT_ID);

  const payload: LoginRequestPayload = req.body;

  verify(client, payload.idToken);

  // check if userId already exists // create if necessary
})



app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}...`);
});
