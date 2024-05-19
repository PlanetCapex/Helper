<script lang="ts">
    import {page} from "$app/stores";
    import moment from 'moment/min/moment-with-locales'
    moment.locale('ru')
</script>

<h1>Edit your todos.</h1>
<form action="" method="post">
    {#if $page.form}
        {#each $page.form as error}
            <div class="error">
                {error.message}
            </div>
        {/each}
    {/if}
    {#if $page.form?.todo}
        <div class="success">
            Задача успешна обновлена: "{$page.form.todo.title}".
        </div>
    {/if}
    <div class="input-group">
        <label for="title">Название</label>
        <input id="title" name="title" type="text" placeholder="Title" value="{$page.data.todo.title}"/>
    </div>

    <div class="input-group">
        <label for="will_be_completed_at">Должно быть выполнено</label>
        <input id="will_be_completed_at" name="will_be_completed_at"
                type="datetime-local"
                value="{moment($page.data.todo.will_be_completed_at).format('YYYY-MM-DDTHH:mm')}"/>
    </div>

    <div class="input-group">
        <label for="completed_at">Было выполнено</label>
        <input id="completed_at" name="completed_at"
               type="datetime-local"
               value="{moment($page.data.todo.completed_at).format('YYYY-MM-DDTHH:mm')}"/>
    </div>

    <div class="info-tab">
        <span>Создано <strong>{moment($page.data.todo.created_at).fromNow()}</strong>.</span>
        <span>Обновлено <strong>{moment($page.data.todo.updated_at).fromNow()}</strong>.</span>
    </div>

    <button type="submit" class="super-button">Изменить</button>
</form>

<style lang="postcss">
    form {
        width: 100%;
        margin: 0 auto;
    }
    .info-tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    .info-tab span {
        font-size: 0.8rem;
    }
</style>