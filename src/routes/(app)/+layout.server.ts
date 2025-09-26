import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const path = url.pathname;
	return {
		path,
	};
};
