import type {Actions} from './$types';
import {fail, redirect} from "@sveltejs/kit";
import type {LoginResponse} from "$lib/interfaces";
import {assign_auth_cookies} from "$lib/server/handleCookie";

export const actions = {
    default: async ({request, cookies, fetch}) => {
        const data = await request.formData();
        const username = data.get("username") as string;
        const password = data.get("password") as string;
        let response: Response;
        let loginData: LoginResponse;

        try {
            response = await fetch(`$api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password})
            })

            loginData = await response.json() as LoginResponse;
        } catch (e) {
            console.log(e);
            return fail(500, {
                error: "Server is not responding, please try again later."
            });
        }

        if (response.ok && 'message_type' in loginData && loginData.message_type === 'success') {
            assign_auth_cookies(response, cookies);
            throw redirect(302, '/');
        } else {
            return fail(400, {
                error: loginData
            });
        }
    }
} satisfies Actions;