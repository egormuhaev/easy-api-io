import { Container } from 'inversify';
import App from './app';
import { appBindings } from './di';
import { TYPES } from './types';

const bootstrap = () => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
};

export const { app, appContainer } = bootstrap();
