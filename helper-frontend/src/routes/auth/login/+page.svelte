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
        <label for="username">Username</label>
        <input id="username" name="username" type="text" placeholder="@your_username">
    </div>
    <div class="input-group">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" placeholder="7ype_p@s$w0rd">
    </div>
    <button type="submit" class="super-button">Login</button>
</form>

