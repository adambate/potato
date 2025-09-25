import { drizzle } from 'drizzle-orm/d1';
import type { AnyD1Database } from 'drizzle-orm/d1';

export function getDb(binding: AnyD1Database) {
	return drizzle(binding, { logger: true });
}

export type ORM = ReturnType<typeof getDb>;
