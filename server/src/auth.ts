import {NextFunction, Request, Response} from 'express';
import {accessTokenToIdToken, idTokenToSub} from './root';

export function auth(req: Request, res: Response, next: NextFunction): void {
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

  req.sub = sub;

  next();
}
