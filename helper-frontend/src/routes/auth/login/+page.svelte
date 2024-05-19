<script>
    import {page} from "$app/stores";
</script>

<!--login page -->
<form action="" method="POST">
    {#if $page.form?.error}
        <div class="error">
            {$page.form.error}
        </div>
    {/if}
    <div class="input-group">
        <label for="username">Имя пользователя</label>
        <input id="username" name="username" type="text" placeholder="username">
    </div>
    <div class="input-group">
        <label for="password">Пароль</label>
        <input id="password" name="password" type="password" placeholder="123456">
    </div>
    <button type="submit" class="super-button">Войти</button>
</form>

