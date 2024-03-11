import { NextFunction, Request, Response } from 'express';
import jwtmod, { TokenExpiredError } from 'jsonwebtoken';
import { IMiddlewares } from '../../common/middlewares.interface';
import { HttpError } from '../../errors/http-error.class';

export class AuthMiddlewhare implements IMiddlewares {
	execute(req: Request, res: Response, next: NextFunction) {
		const bearerHeader = req.headers.authorization;

		const token = bearerHeader && bearerHeader.split(' ')[1];

		if (!token) {
			next(new HttpError(401, 'Unauthorized'));
			next();
		} else {
			const pk =
				'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6IyPN/XCQVSgxFaFh5PnUO8/yYzzxyKOlbGX25RwpTm7tA+9mY7Y+NyajesHTbcFHb+RtwvBwDN1tbBZUJJ/TLDchtWu8T+dvP2ar2WJjkqzCmKdEb4EoMTGCqKFtiZmeV4me08EodHTWwSnZeOjtqc9Uyu1/B5rj8LGdiX+/L9iyKxYpbHPpqjiApynbZ2htNhehBpDMIfZmqTWj2XNHvRJkk+zbJQQ85bwoWTjHbk87jQ/8EPB5rfYmN2pF45UQfZZuzcagL4vJ8ej8PeBpMM8ipyeQSgnqg/T23V+bsicqd0hDcVnMijJmSnvav35x4fbyxqkc+QZEZ0A9NYAgQIDAQAB';

			const publicKey = `-----BEGIN PUBLIC KEY-----\n${pk}\n-----END PUBLIC KEY-----`;

			try {
				const decodedToken = jwtmod.verify(token, publicKey, {
					algorithms: ['RS256'],
				});

				if (typeof decodedToken !== 'string') {
					if (decodedToken.email) {
						req.email = decodedToken?.email;
					}
				}
				console.log(req.email);
				next();
			} catch (e) {
				const error = e as TokenExpiredError;
				if (error.message === 'jwt expired') {
					next(new HttpError(401, error.message));
				}
			}
		}
	}
}
