
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const SUPABASE_URL: string;
	export const SUPABASE_ANON_KEY: string;
	export const SUPABASE_SERVICE_ROLE_KEY: string;
	export const NODE_ENV: string;
	export const CONSOLE_JWT_SECRET: string;
	export const RATE_LIMIT_WINDOW_MS: string;
	export const RATE_LIMIT_MAX_REQUESTS: string;
	export const ENABLE_AUDIT_LOGGING: string;
	export const AUDIT_LOG_LEVEL: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const SHELL: string;
	export const npm_config_global_prefix: string;
	export const COLOR: string;
	export const npm_config_noproxy: string;
	export const npm_config_local_prefix: string;
	export const USER: string;
	export const npm_config_globalconfig: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const PATH: string;
	export const _: string;
	export const npm_package_json: string;
	export const npm_config_userconfig: string;
	export const npm_config_init_module: string;
	export const PWD: string;
	export const npm_command: string;
	export const npm_lifecycle_event: string;
	export const EDITOR: string;
	export const npm_package_name: string;
	export const npm_config_npm_version: string;
	export const npm_config_node_gyp: string;
	export const npm_package_version: string;
	export const npm_config_yes: string;
	export const SHLVL: string;
	export const HOME: string;
	export const npm_config_cache: string;
	export const LOGNAME: string;
	export const npm_lifecycle_script: string;
	export const npm_config_user_agent: string;
	export const npm_node_execpath: string;
	export const npm_config_prefix: string;
	export const VITE_USER_NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_SUPABASE_URL: string;
	export const PUBLIC_SUPABASE_ANON_KEY: string;
	export const PUBLIC_APP_URL: string;
	export const PUBLIC_CUSTOMER_APP_URL: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		SUPABASE_URL: string;
		SUPABASE_ANON_KEY: string;
		SUPABASE_SERVICE_ROLE_KEY: string;
		NODE_ENV: string;
		CONSOLE_JWT_SECRET: string;
		RATE_LIMIT_WINDOW_MS: string;
		RATE_LIMIT_MAX_REQUESTS: string;
		ENABLE_AUDIT_LOGGING: string;
		AUDIT_LOG_LEVEL: string;
		NODE: string;
		INIT_CWD: string;
		SHELL: string;
		npm_config_global_prefix: string;
		COLOR: string;
		npm_config_noproxy: string;
		npm_config_local_prefix: string;
		USER: string;
		npm_config_globalconfig: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		PATH: string;
		_: string;
		npm_package_json: string;
		npm_config_userconfig: string;
		npm_config_init_module: string;
		PWD: string;
		npm_command: string;
		npm_lifecycle_event: string;
		EDITOR: string;
		npm_package_name: string;
		npm_config_npm_version: string;
		npm_config_node_gyp: string;
		npm_package_version: string;
		npm_config_yes: string;
		SHLVL: string;
		HOME: string;
		npm_config_cache: string;
		LOGNAME: string;
		npm_lifecycle_script: string;
		npm_config_user_agent: string;
		npm_node_execpath: string;
		npm_config_prefix: string;
		VITE_USER_NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_SUPABASE_URL: string;
		PUBLIC_SUPABASE_ANON_KEY: string;
		PUBLIC_APP_URL: string;
		PUBLIC_CUSTOMER_APP_URL: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
