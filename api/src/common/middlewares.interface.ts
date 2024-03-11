import { NextFunction, Request, Response } from 'express';

export interface IMiddlewares {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}
