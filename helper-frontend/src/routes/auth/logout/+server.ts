import {redirect} from '@sveltejs/kit';
import type {RequestHandler} from './$types';

export const GET: RequestHandler = ({cookies}) => {
    cookies.delete('sessionid', {
        secure: false,
        path: '/'
    })
    cookies.delete('csrftoken', {
        secure: false,
        path: '/'
    })
    throw redirect(302, "/")
};