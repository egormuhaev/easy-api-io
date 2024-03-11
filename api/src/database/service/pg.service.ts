import { inject, injectable } from 'inversify';
import { Pool, PoolClient } from 'pg';
import { ConfigService } from '../../config/service/config.service';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';

@injectable()
export class PGService {
	client: PoolClient;
	pool: Pool;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: ConfigService,
	) {
		this.pool = new Pool({
			host: this.configService.get('DATABASE_HOST'),
			port: Number(this.configService.get('DATABASE_PORT')) || 5432,
			user: this.configService.get('DATABASE_USER'),
			password: this.configService.get('DATABASE_PASSWORD'),
			database: this.configService.get('DATABASE_NAME'),
			ssl: false,
		});
	}

	async connect(): Promise<void> {
		try {
			this.client = await this.pool.connect();
			this.logger.log('[PostgresSQLService] Выполненно подключение к базе данных');
			this.logger.log(
				`[PostgresSQLService] Целевая схема: ${this.configService.get('DATABASE_SCHEMA')}`,
			);
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error(`[PostgresSQLService] Ошибка подключения к базе данных: ${err.message}`);
			}
		}
	}

	async querySelect<T>(sql: string): Promise<T | null> {
		try {
			await this.client.query('BEGIN');
			const response = (await this.client.query(sql)).rows as T;
			await this.client.query('COMMIT');
			return response;
		} catch (err) {
			await this.client.query('ROLLBACK');
			this.logger.error(`[PostgresSQLService] Ошибка:  ${err}`);
		}

		return null;
	}

	async disconnect(): Promise<void> {
		await this.pool.end();
		this.logger.log('[PostgresSQLService] Выполненно отключение от базы данных');
	}
}
