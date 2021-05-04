import {Request, Response, Router} from 'express';
import {OAuth2Client} from 'google-auth-library';
import {auth} from './auth';
import {LoginRequestBody} from './types';
import {PrismaClient} from '@prisma/client';

const CLIENT_ID = '812267761968-lvohpt9e9uiudh8s0r9s8n6gciqjqrr5.apps.googleusercontent.com';

export const idTokenToSub: Map<string, string> = new Map();
export const accessTokenToIdToken: Map<string, string> = new Map();

export const root = Router();

const prisma = new PrismaClient();

root.get('/', (req, res) => {
  res.send('Hello World');
});

root.post('/auth', async (req: Request<{}, string, LoginRequestBody>, res: Response<string>) => {
  const client: OAuth2Client = new OAuth2Client(CLIENT_ID);
  const {idToken, accessToken} = req.body;

  try {
    await verify(client, idToken);
    accessTokenToIdToken.set(accessToken, idToken);
    const sub = idTokenToSub.get(idToken) ? idTokenToSub.get(idToken) : null;
    if (sub) {
      await prisma.users.create({
        data: {
          google_id: sub,
        },
      });
    }
    res.status(200).end();
  } catch (error) {
    req.log.error(error);
    res.status(401).end();
  }
});

async function verify(client: OAuth2Client, idToken: string): Promise<void> {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (payload) {
    idTokenToSub.set(idToken, payload['sub']);
  } else {
    throw new Error('Was unable to verify auth payload with Google Server');
  }
}

root.get('/sub', auth, (req: Request<{}, string, {}>, res: Response<string>) => {
  res.send(req.sub);
});
