import { injectable } from 'inversify';
import 'reflect-metadata';
import { ILogObj, Logger } from 'tslog';
import { ILogger } from './logger.interface';

@injectable()
export class LoggerService implements ILogger {
	logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger({
			type: 'pretty',
			prefix: ['RTT-TECHNICAL-DELIVERY-API '],
			prettyLogStyles: {
				logLevelName: {
					'*': ['bold', 'black', 'bgWhiteBright', 'dim'],
					SILLY: ['bold', 'green'],
					TRACE: ['bold', 'whiteBright'],
					DEBUG: ['bold', 'green'],
					INFO: ['bold', 'blue'],
					WARN: ['bold', 'yellow'],
					ERROR: ['bold', 'red'],
					FATAL: ['bold', 'redBright'],
				},

				dateIsoStr: 'white',
				filePathWithLine: 'white',
				name: ['white', 'bold'],
				nameWithDelimiterPrefix: ['white', 'bold'],
				nameWithDelimiterSuffix: ['white', 'bold'],
				errorName: ['bold', 'bgRedBright', 'whiteBright'],
				fileName: ['yellow'],
				filePath: undefined,
			},
		});
	}

	silly(...args: unknown[]) {
		this.logger.silly(...args);
	}

	log(...args: unknown[]) {
		this.logger.info(...args);
	}

	error(...args: unknown[]) {
		// отправка в sentry
		this.logger.fatal(...args);
	}

	warn(...args: unknown[]) {
		this.logger.warn(...args);
	}
}
