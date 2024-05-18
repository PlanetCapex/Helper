import type {TodoResponse} from "$lib/interfaces";
import type {RequestHandler} from "./$types";
import {json} from "@sveltejs/kit";


export const GET: RequestHandler = async (event) => {
    const cursor = event.url.searchParams.get("cursor") as string;
    const limit = event.url.searchParams.get("limit") as string;
    const ordering = event.url.searchParams.get("ordering") as string;
    const query = `cursor=${cursor}&limit=${limit}&ordering=${ordering}`;

    const listResponse = await event.fetch(`$api/data/list/all?${query}`, {
        method: "GET",
        headers: event.locals.fetchAuthHeaders
    })
    const list: TodoResponse = await listResponse.json();
    return json(list);
}