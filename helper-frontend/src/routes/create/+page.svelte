<script lang="ts">
    import {page} from "$app/stores";
    import Inline from "$lib/Inline.svelte";

    $: console.log($page.form)
</script>

<h1>Создать новый лист</h1>
<form action="" method="post">
    <div class="input-group">
        <label for="title">Название листа</label>
        <input id="title" name="title" type="text" placeholder="Название">
        <Inline inline="title"/>
    </div>
    <button type="submit" class="super-button">Создать</button>
</form>

<style lang="postcss">
    form {
        width: 100%;
        margin: 0 auto;
    }
</style>