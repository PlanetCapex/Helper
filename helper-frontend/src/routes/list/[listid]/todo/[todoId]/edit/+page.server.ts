import type {Actions, PageServerLoad} from './$types';
import type {Todo} from "$lib/interfaces";

export const load: PageServerLoad = async ({params, locals, fetch}) => {
    const todoId = params.todoId;
    const todosResponse = await fetch(`$api/data/todo/${todoId}`, {
        method: "GET",
        headers: locals.fetchAuthHeaders
    })

    const todo: Todo = await todosResponse.json();
    return {
        todo
    };
};

export const actions = {
    default: async ({request, fetch, locals, params}) => {
        const data = await request.formData();
        const todoID = params.todoId;

        const title = data.get("title") as string;

        const completedAtString = data.get("completed_at") as string;
        const completedAt = completedAtString === "" ? null : new Date(completedAtString).toISOString();

        const willBeCompletedAtString = data.get("will_be_completed_at") as string;
        const willBeCompletedAt = willBeCompletedAtString === "" ? null : new Date(willBeCompletedAtString).toISOString();

        const response = await fetch(`$api/data/todo/${todoID}/update`, {
            method: "PUT",
            headers: locals.fetchAuthHeaders,
            body: JSON.stringify({
                title,
                completed_at: completedAt,
                will_be_completed_at: willBeCompletedAt
            })
        })
        const createdTodoJson: Todo = await response.json();
        return {
            todo: createdTodoJson
        };
    }
} satisfies Actions;