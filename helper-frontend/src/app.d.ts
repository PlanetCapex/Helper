// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('$lib/interfaces').User;
			fetchAuthHeaders: {
				"Content-Type": "application/json";
				Cookie: string;
				"X-CSRFToken": string;
				"X-Forwarded-For": string;
				"X-Real-IP": string;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
