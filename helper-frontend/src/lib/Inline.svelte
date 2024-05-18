<script lang="ts">
    import {page} from '$app/stores';
    import {browser} from '$app/environment';
    import type {ValidationError} from "$lib/interfaces";

    export function find_error_with_error_loc(error_loc: string, details: ValidationError[], from_index: number | null = null): ValidationError | undefined {
        return details.find(detail => {
            if (from_index === null) {
                from_index = detail.loc.length - 1;
            }
            return detail.loc[from_index] === error_loc;
        });
    }

    function useScroll(node: HTMLElement) {
        node.scrollIntoView({behavior: 'instant', block: 'center'});
    }

    export let inline: string;

    let inline_text: string | string[];
    export let from_index: number | null = null
    export let display_ctx: boolean = false;


    $: {
        const detail = $page.form?.detail || $page.form?.error;
        if ($page.form && $page.form?.inline) {
            let error_msg = $page.form.inline[inline];
            if (error_msg) {
                inline_text = [error_msg];
            } else {
                inline_text = [];
            }
        } else if (detail) {
            const error = find_error_with_error_loc(inline, detail, from_index);
            if (error?.ctx && error.ctx.error && display_ctx) {
                inline_text = [error.ctx.error];
            } else if (error?.msg) {
                inline_text = [error.msg];
            } else {
                inline_text = [];
            }
        } else {
            inline_text = [];
        }
    }


    let shake = false;

    $: if (browser) {
        if (inline_text) {
            shake = true;
        }
        setTimeout(() => {
            shake = false;
        }, 960);
    }

    export let className: string = '';
</script>

{#if inline_text?.length > 0}
    <div class="top-wrap" {className}>
        {#each inline_text as text}
            <small use:useScroll class:animate-shake={shake}>
                {text}
            </small>
        {/each}
    </div>
{/if}

<style>
    .top-wrap {
        display: flex;
        /*flex-direction: column;*/
        align-items: center;
        justify-content: start;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .animate-shake {
        animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
    }

    @keyframes shake {
        10%, 90% {
            transform: translate3d(-1px, 0, 0);
        }

        20%, 80% {
            transform: translate3d(2px, 0, 0);
        }

        30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
        }

        40%, 60% {
            transform: translate3d(4px, 0, 0);
        }
    }

    small {
        color: indianred;
        font-size: 0.8rem;
        font-weight: 500;
    }
</style>