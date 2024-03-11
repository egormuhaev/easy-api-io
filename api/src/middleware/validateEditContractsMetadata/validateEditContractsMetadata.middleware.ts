import { NextFunction, Request, Response } from 'express';
import { IMiddlewares } from '../../common/middlewares.interface';

export interface IEditContractsMetadateRequest {
	type: 'r' | 's' | 't' | 'ro';
	date: string;
	sum: number;
	id: string | number;
	contract: string;
}

export class ValidateEditContractsMetadataMiddelware implements IMiddlewares {
	constructor() {}

	execute(
		req: Request<{}, {}, { data: IEditContractsMetadateRequest[] }>,
		res: Response,
		next: NextFunction,
	) {
		const { data } = req.body;

		let filterValidArray: IEditContractsMetadateRequest[] = [];

		for (let i = 0; i < data.length; i++) {
			if (data[i].type && data[i].sum && data[i].date !== '') {
				filterValidArray.push(data[i]);
			}
		}

		req.body.data = filterValidArray;
		next();
	}
}
