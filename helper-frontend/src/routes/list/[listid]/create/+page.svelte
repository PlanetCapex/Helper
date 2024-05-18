<script lang="ts">
    import {page} from "$app/stores";
    import Inline from "$lib/Inline.svelte";

    $: console.log($page.form)
</script>

<h1>Создание новой задачи</h1>
<form action="" method="post">

    <div class="input-group">
        <label for="title">Название задачи</label>
        <input id="title" name="title" type="text" placeholder="Название">
        <Inline inline="title"/>
    </div>

    <div class="input-group">
        <label for="will_be_completed_at">Срок исполнения</label>
        <input id="will_be_completed_at" name="will_be_completed_at"
               type="datetime-local" class="form-control"
               placeholder="Будет завершено">
        <Inline inline="will_be_completed_at"/>
    </div>
    <button type="submit" class="super-button">Создать</button>
</form>

<style lang="postcss">
    form {
        width: 100%;
        margin: 0 auto;
    }
</style>