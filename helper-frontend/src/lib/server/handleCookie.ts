import {parse} from "cookie";
import type {Cookies} from "@sveltejs/kit";

interface CookieFromAPI extends Record<string, string | number | boolean | undefined> {
    csrftoken: string;
    sessionid: string;
    expires: string;
    'Max-Age': number;
    Path: string;
    SameSite: boolean | "lax" | "strict" | "none" | undefined;
}

export function get_cookies(headers: Headers) {
    const setCookieHeader = headers.get('set-cookie');
    if (!setCookieHeader) {
        return {
            csrfCookie: undefined,
            sessionCookie: undefined
        };
    }

    const individualCookieStrings = setCookieHeader.split(/,(?=[^;]*=)/g);
    const cookieArray = individualCookieStrings.map(cookieString => parse(cookieString.trim()));

    const csrfTokenCookie = cookieArray.find(
      cookie => cookie.csrftoken
    ) as CookieFromAPI;
    const sessionIDCookie = cookieArray.find(
      cookie => cookie.sessionid
    ) as CookieFromAPI;

    return {
        csrfCookie: csrfTokenCookie as CookieFromAPI & {sessionid: never},
        sessionCookie: sessionIDCookie as CookieFromAPI & {csrftoken: never}
    };
}

export const assign_auth_cookies = (response: Response, cookies: Cookies) => {
    const cookies_prepared = get_cookies(response.headers);
    if (cookies_prepared.csrfCookie) {
        cookies.set('csrftoken', cookies_prepared.csrfCookie?.csrftoken, {
            maxAge: cookies_prepared.csrfCookie['Max-Age'],
            path: cookies_prepared.csrfCookie.Path,
            secure: false,
            sameSite: cookies_prepared.csrfCookie.SameSite
        });
    }
    if (cookies_prepared.sessionCookie) {
        cookies.set('sessionid', cookies_prepared.sessionCookie?.sessionid, {
            maxAge: cookies_prepared.sessionCookie['Max-Age'],
            path: cookies_prepared.sessionCookie.Path,
            secure: false,
            sameSite: cookies_prepared.sessionCookie.SameSite
        });
    }
    return cookies_prepared;
}