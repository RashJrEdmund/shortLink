<script lang="ts">
    import { page } from "$app/stores";
    import loginGif from "$lib/animations/login.gif";
    import createAccountGif from "$lib/animations/create_account.gif";
    import { COLOR_PALETTE_STORE, THEME } from "../../store/store";

    $: pathname = $page.url.pathname;

    type PageGif = Record<string, string>;

    const pageGif: PageGif = {
        "/login": loginGif,
        "/create-account": createAccountGif,
    };
</script>

<main class="min-h-[calc(100vh-250px)] flex items-center justify-center">
    <div
        style={`background-color: ${$COLOR_PALETTE_STORE[$THEME].bg}`}
        class="flex items-center m-[2rem_auto] p-2 w-[min(1000px,_97vw)] h-fit min-h-[500px] gap-3"
    >
        {#if pathname === "/login"}
            <slot />
        {/if}

        <section
            style={`
                background-image: url(${pageGif[pathname]});
                background-position: center;
                background-size: cover;
            `}
            class="hidden md:flex flex-1 w-full h-full min-h-[475px] rounded-md"
        />

        <slot name="forgot-password"/>

        {#if pathname === "/create-account"}
            <slot />
        {/if}
    </div>
</main>
