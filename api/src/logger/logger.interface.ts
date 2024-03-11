import { ILogObj, Logger } from 'tslog';

export interface ILogger {
	logger: Logger<ILogObj>;
	silly: (...args: unknown[]) => void;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
