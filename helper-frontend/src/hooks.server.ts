import type {Handle, HandleFetch, RequestEvent} from '@sveltejs/kit';
import {sequence} from '@sveltejs/kit/hooks';
import {SECRET_BASE_API} from '$env/static/private';
import type {User} from "$lib/interfaces";

async function getUser(event: RequestEvent): Promise<User | null> {
    try {
        const response = await event.fetch(`$api/user/get-user`, {
            method: 'GET',
            headers: event.locals.fetchAuthHeaders
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.log(e);
        return null;
    }
    return null;
}


const handleAuth = (async ({event, resolve}) => {
    const SESSION_ID = event.cookies.get('sessionid') as string;
    const CSRF_TOKEN = event.cookies.get('csrftoken') as string;

    event.locals.fetchAuthHeaders = {
        'Content-Type': 'application/json',
        'Cookie': `sessionid=${SESSION_ID};csrftoken=${CSRF_TOKEN}`,
        'X-CSRFToken': CSRF_TOKEN,
        'X-Forwarded-For': event.request.headers.get('X-Forwarded-For') || 'unknown',
        'X-Real-IP': event.request.headers.get('X-Real-IP') || 'unknown'
    };

    if (SESSION_ID && SESSION_ID.length === 32) {
        const user = await getUser(event);
        if (user && 'id' in user) {
            event.locals.user = user;
        }
    }

    return resolve(event);
}) satisfies Handle;

export const handle = sequence(
    handleAuth
);

export const handleFetch: HandleFetch = async ({request, fetch}) => {
    if (request.url.includes('$api/')) {
        let requestUrl = request.url.split('$api/')[1];
        requestUrl = `${SECRET_BASE_API}/${requestUrl}`;

        let options: any = {
            method: request.method,
            headers: request.headers,
            cache: request.cache,
            credentials: request.credentials,
            mode: request.mode,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
            integrity: request.integrity,
            keepalive: request.keepalive,
            signal: request.signal,
            redirect: request.redirect
        };

        const isBodyAllowed = request.method === 'POST'
            || request.method === 'PUT'
            || request.method === 'PATCH';

        if (isBodyAllowed) {
            options = {
                ...options,
                body: await request.text()
            };
        }

        return fetch(requestUrl, options);
    }
    return fetch(request);
};