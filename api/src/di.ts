import { ContainerModule, interfaces } from 'inversify';
import App from './app';
import { PGService } from './database/service/pg.service';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';

import { ConfigService } from './config/service/config.service';
import { IConfigService } from './config/service/config.service.interface';
import { IExeptionFilter } from './errors/exeprion.filter.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { TYPES } from './types';
import { UsersController } from './users/controller/users.controller';
import { IUsersController } from './users/controller/users.controller.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	// USERS
	bind<IUsersController>(TYPES.UserController).to(UsersController).inSingletonScope();

	// DATABASE
	bind<PGService>(TYPES.PGService).to(PGService).inSingletonScope();

	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();

	// UTILS
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();

	bind<App>(TYPES.Application).to(App).inSingletonScope();
});
