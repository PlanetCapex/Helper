<script lang="ts">
    import {enhance} from "$app/forms";
    import {flip} from 'svelte/animate';
    import {page} from "$app/stores";
    import moment from 'moment/min/moment-with-locales'
    import {quintOut} from "svelte/easing";
    import {onMount} from "svelte";
    import {writable} from "svelte/store";

    moment.locale('ru')
    $: paginated_todos = $page.data.todos;
    let loading = writable(false);

    async function fetch_and_assign_paginated_todos() {
        let {cursor, limit, ordering, has_next} = paginated_todos;
        if (has_next) {
            fetch(`/api/get-more?cursor=${cursor}&limit=${limit}&ordering=${ordering}`)
                .then(res => res.json())
                .then(data => {
                    paginated_todos = {
                        items: [...paginated_todos.items, ...data.items],
                        cursor: data.cursor,
                        limit: data.limit,
                        ordering: data.ordering,
                        has_next: data.has_next
                    }
                });
        }
    }

    let on_scroll_timeout: number;

    async function on_scroll_set_paginated_todos(event: Event) {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 1700) {
            if ($loading) return;
            $loading = true;
            clearTimeout(on_scroll_timeout);
            on_scroll_timeout = setTimeout(fetch_and_assign_paginated_todos, 40);
            $loading = false;
        }
    }

    onMount(fetch_and_assign_paginated_todos);

    $: if ($page.form) {
        let todo = $page.form;
        if ('id' in todo) {
            paginated_todos.items = paginated_todos.items.map(todo => {
                if (todo.id === $page.form.id) {
                    return $page.form;
                }
                return todo;
            });
        }
    }
</script>

<svelte:window on:scroll={on_scroll_set_paginated_todos}/>

<div class="todo-container">
    {#if $page.data.list.title != undefined}
        <h1>Лист задач "{$page.data.list.title}"</h1>
    <div class="menu">
    <li class="action primary" class:active={$page.url.pathname === '/create'}>
        <a href="{$page.url.pathname}/create">Добавить задачу</a>
    </li>
    </div>
    {:else}
    <h1>Такой страницы нет</h1>
    {/if}
    {#if paginated_todos?.items}
        <div class="todo-list" class:loading={$loading}>
            {#each paginated_todos?.items as todo (todo.id)}
                <form class="todo" class:completed={todo.completed_at} action="" method="post"
                      animate:flip={{ delay: 0, duration: 850, easing: quintOut }}
                      use:enhance>
                    <h3>{todo.title}</h3>
                    <div class="todo-wrap">
                        <input type="hidden" name="todoID" value={todo.id}/>
                        <small>
                            {todo.completed_at ? '✅' : '🔴'}
                            {#if todo.completed_at && moment(todo.completed_at).isBefore(todo.will_be_completed_at)}
                                Выполнено  <strong>заранее за {moment.utc(todo.will_be_completed_at).from(moment.utc(todo.completed_at), true)}
                                </strong>.
                            {:else if todo.completed_at}
                                Выполнено <strong>c опозданием на {moment.utc(todo.completed_at).from(moment.utc(todo.will_be_completed_at), true)}
                                </strong>.
                            {:else if (!(moment().local().isBefore(moment(todo.will_be_completed_at))))}
                                Просрочена <strong>{moment.utc(todo.will_be_completed_at).from(moment().local()}</strong>.
                            {:else}
                                До конца <strong>{moment(todo.will_be_completed_at).from(moment().local())}</strong>.
                            {/if}
                        </small>

                        <div class="todo-action">
                            <a href="{$page.url.pathname}/todo/{todo.id}/edit">Изменить</a>
                            <button formaction="?/delete">
                                Удалить
                            </button>
                            <button formaction="?/toggleMarkAsCompleted" >
                                {todo.completed_at ? 'Пометить как не выполненую' : 'Пометить как выполненую'}
                            </button>
                            <input name="markAs" value="{todo.completed_at ? 'uncompleted': 'completed'}" hidden>
                        </div>
                    </div>
                </form>
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">

    .menu {
        padding-bottom: 0.5rem;
    }

    .todo-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .todo-list.loading {
        pointer-events: none;
        opacity: 50%;
    }

    .todo-list {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    li {
        font-size: 1.5rem;
        display: block;
    }

    li a {
        text-decoration: none;
        color: #FFF;
    }

    li:hover {
        transition: 0.2s;
        color:#111
    }

    .action {
        padding: 0.5rem 0.4rem;
        border-radius: 5rem;
    }

    .action.primary  {
        background-color: #333;
    }
    .action.primary:hover  {
        background-color: #111;
    }

    .todo {
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 1rem 2rem;
        border-radius: 1rem;
        border: 1px solid #e0eaee;
        background-color: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .todo.completed {
        background-color: #f0f7f9;
        border: 1px solid #c8dce1;
    }

    .todo h3 {
        font-size: 1.5rem;
        font-weight: bold;
        color: rgb(44, 48, 51);
        margin: 0;
    }

    .todo small {
        font-size: 0.8rem;
        color: #061624;
        max-width: 70%;
    }

    .todo-action a, .todo-action button {
        color: #042847;
        text-decoration: none;
        font-size: 0.8rem;
        font-weight: bold;
        padding: 0;
        border: none;
        background-color: transparent;
        margin: 0;
        cursor: pointer;
    }

    .todo-action a {
    }

    .todo-action a:hover, .todo-action button:hover {
        text-decoration: underline;
        color: #1d5788;
    }

    .todo a:hover {
        text-decoration: underline;
    }

    .todo-action {
        display: flex;
        align-items: end;
        justify-content: space-between;
        border-bottom: 1px solid #e0eaee;
    }

    .todo-wrap {
        display: flex;
        justify-content: space-between;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 1rem;
        }
    }


    .todo-action {
        display: flex;
        gap: 1rem;

        @media (max-width: 768px) {
            justify-content: space-between;
        }
    }
</style>
