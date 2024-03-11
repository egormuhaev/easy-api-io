import { NextFunction, Request, Response } from 'express';
import { IMiddlewares } from '../../common/middlewares.interface';
import { HttpError } from '../../errors/http-error.class';

interface TargetParametrsType {
	startDate: string;
	endDate: string;
}

export class ValidateDateTimeParamsMiddleware implements IMiddlewares {
	execute(req: Request, res: Response, next: NextFunction) {
		const { startDate, endDate } = req.body;

		if (startDate && endDate) {
			const dateAsNewFormat = this.convertingDateToDesiredStringForm(startDate, endDate);
			if (dateAsNewFormat) {
				if (this.comparisonDate(dateAsNewFormat)) {
					return next();
				}
			}
		}

		return next(new HttpError(400, 'Bad Request'));
	}

	private dateFormater(date: string): string | null {
		const dateAsArray = date.split('-');
		if (dateAsArray.length === 3) {
			return `${dateAsArray[2]}-${dateAsArray[1]}-${dateAsArray[0]}`;
		}

		return null;
	}

	private comparisonDate(dates: TargetParametrsType) {
		if (dates.startDate >= dates.endDate) {
			return false;
		}

		return true;
	}

	private convertingDateToDesiredStringForm(
		startDate: string,
		endDate: string,
	): TargetParametrsType | null {
		const newStartDate = this.dateFormater(startDate);
		const newEndDate = this.dateFormater(endDate);

		if (newStartDate && newEndDate) {
			return {
				startDate: newStartDate,
				endDate: newEndDate,
			};
		}

		return null;
	}
}
