import type {Actions, PageServerLoad} from './$types';
import type {Todo, TodoResponse, List, MessageOut} from "$lib/interfaces";

export const actions = {
    toggleMarkAsCompleted: async ({request, cookies, fetch, locals}) => {
        const data = await request.formData();
        const todoID = data.get("todoID") as string;

        const response = await fetch(`$api/data/todo/${todoID}/toggle-as-complete`, {
            method: "PATCH",
            headers: locals.fetchAuthHeaders
        })
        const createdTodoJson: Todo = await response.json();
        return createdTodoJson;
    },
    delete: async ({request, cookies, fetch, locals}) => {
        const data = await request.formData();
        const todoID = data.get("todoID") as string;

        const response = await fetch(`$api/data/todo/${todoID}/delete`, {
            method: "PATCH",
            headers: locals.fetchAuthHeaders
        })
        data.delete(todoID);
    }
} satisfies Actions;


export const load: PageServerLoad = async ({locals, params, fetch}) => {
    const listID = params.listid;
    const todosResponse = await fetch(`$api/data/todo/all?limit=7&ordering=desc&list_id=${listID}`, {
        method: "GET",
        headers: locals.fetchAuthHeaders
    })
        const listResponse = await fetch(`$api/data/list/${listID}`, {
        method: "GET",
        headers: locals.fetchAuthHeaders
    })
    const list: List = await listResponse.json();

    const todos: TodoResponse = await todosResponse.json();
    return {todos, list};
};

