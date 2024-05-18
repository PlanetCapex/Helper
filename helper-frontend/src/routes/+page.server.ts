import type {Actions, PageServerLoad} from './$types';
import type {List, ListResponse, MessageOut} from "$lib/interfaces";
import {fail, error, redirect} from "@sveltejs/kit";

export const actions = {
    delete: async ({request, cookies, fetch, locals}) => {
        const data = await request.formData();
        const listID = data.get("listID") as string;

        const response = await fetch(`$api/data/list/${listID}/delete`, {
            method: "PATCH",
            headers: locals.fetchAuthHeaders
        })
        const deleteResponse = await response.text();

        if (deleteResponse == '200') {
            throw redirect(302, "/");
        }
    },
    invite: async ({request, cookies, fetch, locals}) => {
        const data = await request.formData();
        const username = data.get("username") as string;
        const list_id = data.get("listID") as string;

        const response = await fetch(`$api/data/list/invite`, {
            method: "POST",
            headers: locals.fetchAuthHeaders,
            body: JSON.stringify({username, list_id})
        })

        const inviteResponse = await response.text();

        if (inviteResponse == '200') {
            throw redirect(302, "/");
        }

        throw error(404, {
            message: 'Пользователь не найден'
        });
    },
    showmodal:async ({request, cookies, fetch, locals}) => {
    },
} satisfies Actions;


export const load: PageServerLoad = async ({locals, fetch}) => {
    const todosResponse = await fetch(`$api/data/list/all?limit=7&ordering=desc`, {
        method: "GET",
        headers: locals.fetchAuthHeaders
    })
    const lists: ListResponse = await todosResponse.json();
    return {lists};
};