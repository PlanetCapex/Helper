import type { LayoutServerLoad } from './$types';
import {redirect} from "@sveltejs/kit";

export const load: LayoutServerLoad = ({ locals }) => {
    if (locals.user?.is_authenticated) {
        throw redirect(302, "/");
    }
};