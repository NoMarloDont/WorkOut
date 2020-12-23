
import {Request, Response, Router} from 'express';
import {LoginRequestBody} from './types';
import {OAuth2Client} from 'google-auth-library';

const CLIENT_ID = '812267761968-lvohpt9e9uiudh8s0r9s8n6gciqjqrr5.roots.googleusercontent.com';

const subToUserIds: Map<string, number> = new Map();
const idTokenToSub: Map<string, string> = new Map();
const accessTokenToIdToken: Map<string, string> = new Map();

const root = Router();

root.get('/', (req, res) => {
  res.send('Hello World');
});

root.post('/auth', async (req: Request<{}, string, LoginRequestBody>, res: Response<string>) => {
  const client: OAuth2Client = new OAuth2Client(CLIENT_ID);
  const {idToken, accessToken} = req.body;

  try {
    await verify(client, idToken);
    accessTokenToIdToken.set(accessToken, idToken);
    res.status(200).end();
  } catch (error) {
    req.log.error(error);
    res.status(401).end();
  }
});

root.get('/sub', (req: Request<{}, string, {}>, res: Response<string>) => {
  const accessToken = req.header('Authorization');
  if (!accessToken) {
    res.status(401).end();
    return;
  }

  const idToken = accessTokenToIdToken.get(accessToken);
  if (!idToken) {
    res.status(401).end();
    return;
  }

  const sub = idTokenToSub.get(idToken);
  if (!sub) {
    res.status(401).end();
    return;
  }

  res.send(sub);
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

export default root;