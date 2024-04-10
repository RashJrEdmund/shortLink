<script lang="ts">
    import { enhance } from "$app/forms";
    import ATag from "$components/atoms/A_Tag.svelte";
    import Button from "$components/atoms/Button.svelte";
    import HeaderText from "$components/atoms/HeaderText.svelte";
    import PTag from "$components/atoms/P_Tag.svelte";
    import SpanTag from "$components/atoms/SpanTag.svelte";
    import TextField from "$components/atoms/TextField.svelte";
    import { COLOR_PALETTE_STORE, THEME } from "../../../store/store";
    import type { ActionData } from "./$types";
    import { goto } from "$app/navigation";
    import { validateEmail } from "$services/functions/validation";

    export let form: ActionData; // the object returned from the default action on +page.server.ts;

    let username: string = form?.username ?? "";
    let email: string = form?.email ?? "";
    let password: string = "";
    let confirm_password: string = "";

    let loading: boolean = false;
    let showpassword: boolean = false;
    let showConfirmPassword: boolean = false;

    let isValidEmail: boolean = false;

    const handleEnhancement = async ({ formElement, formData, action, cancel }: any) => {
        loading = true;

        if (!email || !password || !confirm_password || !isValidEmail) {
            loading = false;
            cancel();
        }

        email = "";
        password = "";
        confirm_password = "";

        return async ({ update, result }: any) => {
            await update();
            loading = false;
            if (result.data.status === 200 && result.data.current_user) goto("/");
        }
    }
</script>

<form slot="forgot-password">
    forgot password
</form>
