import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/base.controller';
import { PGService } from '../../database/service/pg.service';
import { HttpError } from '../../errors/http-error.class';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.PGService) private pgService: PGService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/signIn',
				method: 'post',
				func: this.signIn,
				middlewares: [],
			},
			{
				path: '/signUp',
				method: 'post',
				func: this.signUp,
				middlewares: [],
			},
		]);
	}

	async signIn(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body;
			const user: any[] | null = await this.pgService.querySelect(
				`SELECT id FROM apio.users WHERE username = '${username}' and password = '${password}'`,
			);

			if (user) {
				this.ok(res, user[0]);
			} else {
				next(new HttpError(301, 'Unauthorized'));
			}
		} catch (e) {
			this.loggerService.error(e);
			next(new HttpError(401, 'Invalid username or password'));
		}
	}

	async signUp(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body;
			const user: string[] | null = await this.pgService.querySelect(
				`SELECT id FROM apio.users WHERE username = '${username}'`,
			);

			if (user?.length === 0) {
				await this.pgService.client.query('BEGIN');
				const db_operation = await this.pgService.client.query(
					`INSERT INTO apio.users (username, password) VALUES ('${username}', '${password}')`,
				);
				await this.pgService.client.query('COMMIT');

				if (db_operation) this.ok(res, true);
				else next(new HttpError(301, 'Unauthorized'));
			} else {
				next(new HttpError(401, 'Invalid username or password'));
			}
		} catch (e) {
			next(new HttpError(401, 'Invalid username or password'));
			this.loggerService.error(e);
		}
	}
}
