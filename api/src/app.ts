import { json } from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'node:http';
import 'reflect-metadata';
import { IConfigService } from './config/service/config.service.interface';
import { PGService } from './database/service/pg.service';
import { IExeptionFilter } from './errors/exeprion.filter.interface';
import { ILogger } from './logger/logger.interface';
import { RequestMiddleware } from './middleware/requestLog/requestLog.middleware';
import { TYPES } from './types';
import { UsersController } from './users/controller/users.controller';

@injectable()
class App {
	private app: Express;
	private server: Server;
	private port: number;
	private key: Buffer;
	private cert: Buffer;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.PGService) private pgService: PGService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserController) private userController: UsersController,
	) {
		this.app = express();
		this.port = Number(this.configService.get('PORT')) || 8001;

		// this.key = fs.readFileSync(__dirname + '/../https/rtt.digital.key');
		// this.cert = fs.readFileSync(__dirname + '/../https/rtt.digital.crt');
	}

	useRoutes() {
		this.app.use('/api/users', this.userController.router);
	}

	useMiddleware() {
		// const authMiddlewhare = new AuthMiddlewhare();
		const requestMiddleware = new RequestMiddleware(this.logger);
		const corsOptions = {
			origin: '*',
			methods: ['GET', 'POST'],
			credential: true,
		};

		this.app.use(cors(corsOptions));
		this.app.use(json());
		// this.app.use(authMiddlewhare.execute.bind(authMiddlewhare));
		this.app.use(requestMiddleware.execute.bind(requestMiddleware));
	}

	useExeptionFilters() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init() {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.pgService.connect();
		// this.server = https.createServer(
		// 	{
		// 		key: this.key,
		// 		cert: this.cert,
		// 	},
		// 	this.app,
		// );
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Server start on port: ${this.port}`);
		});
		// this.server.listen(this.port, () => {
		// 	this.logger.log(`Server start on port: ${this.port}`);
		// });
	}
}

export default App;
