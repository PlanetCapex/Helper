<script lang="ts">
    import {enhance} from "$app/forms";
    import {flip} from 'svelte/animate';
    import {page} from "$app/stores";
    import moment from 'moment/min/moment-with-locales'
    import {quintOut} from "svelte/easing";
    import {onMount} from "svelte";
    import {writable} from "svelte/store";
    import Modal from '../lib/modals/modal.svelte';
    import Inline from "$lib/Inline.svelte";

    moment.locale('ru')
    $: paginated_lists = $page.data.lists;
    let loading = writable(false);
    let showModal = false;
    let listID;
    function show_modal(list_id){
        showModal = true;
        listID = list_id
    }
    async function fetch_and_assign_paginated_lists() {
        let {cursor, limit, ordering, has_next} = paginated_lists;
        if (has_next) {
            fetch(`/api/get-more-list?cursor=${cursor}&limit=${limit}&ordering=${ordering}`)
                .then(res => res.json())
                .then(data => {
                    paginated_lists = {
                        items: [...paginated_lists.items, ...data.items],
                        cursor: data.cursor,
                        limit: data.limit,
                        ordering: data.ordering,
                        has_next: data.has_next
                    }
                });
        }
    }

    let on_scroll_timeout: number;

    async function on_scroll_set_paginated_lists(event: Event) {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 2000) {
            if ($loading) return;
            $loading = true;
            clearTimeout(on_scroll_timeout);
            on_scroll_timeout = setTimeout(fetch_and_assign_paginated_lists, 40);
            $loading = false;
        }
    }

    onMount(fetch_and_assign_paginated_lists);

    $: if ($page.form) {
        let list = $page.form;
        if ('id' in list) {
            paginated_lists.items = paginated_lists.items.map(list => {
                if (list.id === $page.form.id) {
                    return $page.form;
                }
                return list;
            });
        }
    }
</script>

<svelte:window on:scroll={on_scroll_set_paginated_lists}/>

<div class="list-container">

    {#if paginated_lists?.items}
    <h1>Доступные листы задач</h1>
        <div class="list-list" class:loading={$loading}>
            {#each paginated_lists?.items as list (list.id)}
                <form class="list" class:completed={list.completed_at} action="" method="post"
                      animate:flip={{ delay: 0, duration: 850, easing: quintOut }}
                      use:enhance>
                    <h3>{list.title}</h3>
                    <div class="list-wrap">
                        <input type="hidden" name="listID" value={list.id}/>
                        <small>
                           Создано {moment.utc(list.created_at).format("YYYY-MM-DD")}
                        </small>

                        <div class="list-action">
                            <a href="/list/{list.id}">Открыть</a>
                           <button formaction="?/showmodal" on:click={show_modal(list.id)}>Пригласить пользователя</button>
                            <button formaction="?/delete">
                                Удалить
                            </button>
                        </div>
                    </div>
                </form>
            {/each}
        </div>
    {:else}
        <div class="empty-list">
        Нет доступных листов задач
        </div>
    {/if}

</div>
<Modal bind:showModal>
<form action="?/invite" method="post">
    <div class="input-group">
        <label for="username">Имя пользователя</label>
        <input id="username" name="username" type="text" placeholder="username">
        <input id="listID" name="listID" type="hidden" value={listID}>
        <Inline inline="username"/>
    </div>
       <button type="submit" class="super-button">Пригласить пользователя</button>
</form>
</Modal>
<style lang="postcss">


    .list-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .list-list.loading {
        pointer-events: none;
        opacity: 50%;
    }

    .list-list {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    .list {
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

    .list.completed {
        background-color: #f0f7f9;
        border: 1px solid #c8dce1;
    }

    .list h3 {
        font-size: 1.5rem;
        font-weight: bold;
        color: rgb(44, 48, 51);
        margin: 0;
    }

    .list small {
        font-size: 0.8rem;
        color: #061624;
        max-width: 70%;
    }

    .list-action a, .list-action button {
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

    .list-action a {
    }

    .list-action a:hover, .list-action button:hover {
        text-decoration: underline;
        color: #1d5788;
    }

    .list a:hover {
        text-decoration: underline;
    }

    .list-action {
        display: flex;
        align-items: end;
        justify-content: space-between;
        border-bottom: 1px solid #e0eaee;
    }

    .list-wrap {
        display: flex;
        justify-content: space-between;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 1rem;
        }
    }


    .list-action {
        display: flex;
        gap: 1rem;

        @media (max-width: 768px) {
            justify-content: space-between;
        }
    }
</style>
