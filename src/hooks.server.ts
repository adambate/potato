import { getDb } from '$lib/server/db';
import { sessionHooks, kindeAuthClient, type Handler } from '@kinde-oss/kinde-auth-sveltekit';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const APP_FLAG = 'stack-access';
const ROUTE_ACCESS: { route: string; isPrefix?: boolean; perms?: string }[] = [
	{ route: '/', perms: undefined },
	{ route: '/api/', isPrefix: true, perms: undefined },
	{ route: '/team/', isPrefix: true, perms: 'team:access' },
	{ route: '/', isPrefix: true, perms: 'user:login' },
];

function canAccess(path: string, permissions: Set<string>) {
	for (const ra of ROUTE_ACCESS) {
		const isMatch = ra.isPrefix ? path.startsWith(ra.route) : path === ra.route;
		if (isMatch) {
			return ra.perms ? permissions.has(ra.perms) : true;
		}
	}
	return false;
}

const handleDb: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env.DB) {
		return error(500, 'No database available');
	}
	const db = getDb(event.platform.env.DB);
	event.locals.db = db;
	const res = await resolve(event);
	return res;
};

const handleAuth: Handler = async ({ event, resolve }) => {
	sessionHooks({ event });
	event.locals.permissions = new Set<string>();
	const isAuth = await kindeAuthClient.isAuthenticated(event.request);
	if (isAuth) {
		event.locals.user = await kindeAuthClient.getUser(event.request);
		const access = await kindeAuthClient.getPermissions(event.request);
		const isAppUser = await kindeAuthClient.getBooleanFlag(event.request, APP_FLAG, true);
		if (isAppUser) {
			event.locals.permissions = new Set(access.permissions);
			event.locals.permissions.add('user:login');
		}
	} else if (!canAccess(event.url.pathname, event.locals.permissions)) {
		redirect(303, `/api/auth/login?post_login_redirect_url=${event.url.pathname}`);
	}
	if (!canAccess(event.url.pathname, event.locals.permissions)) {
		error(404);
	}
	const response = await resolve(event);
	return response;
};

export const handle: Handle = sequence(handleDb, handleAuth as Handle);
