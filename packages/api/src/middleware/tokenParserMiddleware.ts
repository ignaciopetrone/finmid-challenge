import { Request, Response, NextFunction } from 'express';
import { badRequest } from '@hapi/boom';

const jwtDecode = (token?: string | string[]): any | null => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
  } catch (error) {
    return null;
  }
};

export type ParsedToken = {
  userData: {
    id: string;
    smeId: string;
    name: string;
    email: string;
    profileImage: string;
  };
  iat: number;
  exp: number;
};

// Using cookies to store tokens eliminates the need to manually add them to request headers in the frontend, offering several benefits:
//  - Simplified Frontend Code: The browser automatically includes the cookie in requests, making the frontend cleaner and simpler
//  - Consistent Token Management: Tokens are handled and validated consistently on the server side, reducing potential errors
//  - Enhanced Security: HTTP-only cookies are more secure than localStorage as they are not accessible via JavaScript, reducing XSS risk. Secure cookies ensure transmission over HTTPS
//  - Automatic Inclusion in Requests: Cookies are included in requests automatically, ensuring authenticated requests without additional frontend code

/**
 * Extracts the token from the `cookie`, parses and returns it.
 *
 * Throws `badRequest()` from `@hapi/boom`:
 * - when the token are not found
 * - when the token is not able to be parsed by `jwtDecode()`
 *
 * @throws badRequest
 * @param req
 * @returns {ParsedToken} parsed token
 */
export const extractToken = (req: Request): ParsedToken => {
  const token = req.cookies.authToken;

  if (!token) {
    throw badRequest('Expected authorization cookie');
  }

  const parsedToken = jwtDecode(token);

  if (!parsedToken || !parsedToken.userData.id || !parsedToken.userData.smeId) {
    throw badRequest('Token could not be parsed');
  }

  return parsedToken;
};

export const tokenParserMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const parsedToken = extractToken(req);
    req.body.userData = parsedToken.userData;
    return next();
  } catch (e: any) {
    return next(e);
  }
};
