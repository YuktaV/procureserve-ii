import adapter from '@sveltejs/adapter-vercel';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x'
		}),
		alias: {
			'$shared-types': resolve('../../packages/shared-types'),
			'$shared-utils': resolve('../../packages/shared-utils'),
			'$database-types': resolve('../../packages/database-types')
		}
	}
};

export default config;
