import type {Actions} from './$types';
import {fail, redirect} from "@sveltejs/kit";

export const actions = {
    default: async ({request, cookies, fetch, locals, params}) => {
        const data = await request.formData();
        const list_id = params.listid;
        const title = data.get("title") as string;
        const will_be_completed_at = data.get("will_be_completed_at") as string;

        const response = await fetch(`$api/data/todo/create`, {
            method: "POST",
            headers: locals.fetchAuthHeaders,
            body: JSON.stringify({title, list_id, will_be_completed_at})
        })

        const createdTodoJson = await response.json();

        if (createdTodoJson.id) {
            throw redirect(302, "/list/${list_id}");
        }

        return fail(400, createdTodoJson);

    }
} satisfies Actions;