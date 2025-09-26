import { getDb } from '$lib/server/db';
import { error, type Handle } from '@sveltejs/kit';

const handleDb: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env.DB) {
		return error(500, 'No database available');
	}
	const db = getDb(event.platform.env.DB);
	event.locals.db = db;
	const res = await resolve(event);
	return res;
};

export const handle: Handle = handleDb;
