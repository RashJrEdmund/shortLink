<script lang="ts">
    import { COLOR_PALETTE_STORE, THEME } from "../../store/store";

    export let pink_alert: boolean = false;
    export let success: boolean = false; // TODO +=> make use of this
    export let is_link: boolean = false;
    export let other_tags: boolean = false;
    export let no_wrap: boolean = false;
    export let box: boolean = false;
    export let sx: string = ""; // add extra styling

    export let path: string = "";
    export let target: "_self" | "_parent" | "_top" | "_blank" = "_self";

    export let action = () => null;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<a
    data-sveltekit-preload-data="hover"
    on:click={action}
    href={path}
    target={target}
    {...$$restProps}
    style={`color: ${
        pink_alert
            ? $COLOR_PALETTE_STORE[$THEME].main_pink
            : is_link
            ? $COLOR_PALETTE_STORE[$THEME].lite_blue
            : $COLOR_PALETTE_STORE[$THEME].lite_gray
    };
    `}
    class={`
        $${other_tags && "flex items-center justify-center gap-[2px]"}
        $${
            no_wrap &&
            "flex items-center justify-center flex-nowrap whitespace-nowrap gap-[2px]"
        }
        ${is_link && "underline cursor-pointer"}
        ${box && "border p-1"}
        ${sx}
    `}
>
    <slot />
</a>
