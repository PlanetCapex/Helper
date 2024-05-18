export interface LoginResponse {
    session_key: string,
    is_authenticated: boolean,
    expiry_age: number,
    csrf_token: string,
    id: string
}


export interface User {
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    is_authenticated: boolean,
    id: number
}
export interface List {
    id: number,
    title: string,
    created_at: string,
    updated_at: string
}

export interface Todo {
    id: number,
    title: string,
    will_be_completed_at: string
    completed_at: string,
    created_at: string,
    updated_at: string
}

export interface TodoResponse {
    object_list: Todo[],
    previous_page_number: number,
    next_page_number: number,
}

export interface ListResponse {
    object_list: List[],
    previous_page_number: number,
    next_page_number: number,
}

type MessageType = 'success' | 'error' | 'warning' | 'info';

export type MessageOut = {
    message_type: MessageType
    alias: string;
    action_path?: string;
};


export type ValidationError = {
    type: string;
    loc: ['body', 'data', ...string[]];
    msg: string;
    ctx?: Record<string, string>;
};
