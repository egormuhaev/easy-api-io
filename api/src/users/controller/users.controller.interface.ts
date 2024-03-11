import { NextFunction, Request, Response } from 'express';

export interface IUsersController {
	signIn: (req: Request, res: Response, next: NextFunction) => void;
	signUp: (req: Request, res: Response, next: NextFunction) => void;
}
