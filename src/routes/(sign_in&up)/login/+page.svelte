<script lang="ts">
    import type { ActionData } from "./$types";
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";

    import ATag from "$components/atoms/A_Tag.svelte";
    import Button from "$components/atoms/Button.svelte";
    import HeaderText from "$components/atoms/HeaderText.svelte";
    import PTag from "$components/atoms/P_Tag.svelte";
    import SpanTag from "$components/atoms/SpanTag.svelte";
    import TextField from "$components/atoms/TextField.svelte";
    import { COLOR_PALETTE_STORE, THEME } from "../../../store/store";
    import { validateEmail } from "$services/functions/validation";

    export let form: ActionData; // the object returned from the default action on +page.server.ts;

    let email: string = "";
    let password: string = "";
    let showpassword: boolean = false;

    let isValidEmail: boolean = false;
    let loading: boolean = false;

    $: response = {
        message: form?.message || "",
        status: form?.status,
        data: form?.data || null,
    }

    const handleEnhancement = async ({ formElement, formData, action, cancel }: any) => {
        loading = true;

        if (!email || !password || !isValidEmail) {
            loading = false;
            cancel();
        }
        email = "";
        password = "";

        return async ({ update, result }: any) => {
            await update();
            loading = false;
            if (result.data.status === 200 && result.data.current_user) goto("/");
            else {
                response.status = result.data.status;
                response.message = result.data.message;
            }
        }
    }

    $: (() => {
        console.log("form ", form)
        if (email) isValidEmail = validateEmail(email);
        else isValidEmail = true;
    })();
</script>

<form
    use:enhance={handleEnhancement}
    method="post"
    style={`border-left: 1px solid ${$COLOR_PALETTE_STORE[$THEME].lite_gray}`}
    class="flex flex-col pl-3 flex-1 w-full min-h-[500px]"
>
    <HeaderText text="Login" small />

    <SpanTag pink_alert={response?.status !== 200} success={response?.status === 200}>{response?.message || ""}</SpanTag>

    {#if loading}
        <SpanTag success>Loading...</SpanTag>
    {/if}

    <TextField
        bind:value={email}
        type="text"
        placeholder="Enter email"
        name="email"
        error_message={isValidEmail ? "" : "Not a valid email"}
        success_message={validateEmail(email) ? "✅ valid" : ""}
    />

    <TextField
        bind:value={password}
        type={showpassword ? "text" : "password"}
        placeholder="Password"
        name="password"
        sx="mt-5"
    >
        <SpanTag
            action={() => {
                showpassword = !showpassword;
                return null
            }}
            sx="cursor-pointer"
        >
            {showpassword ? "🚫" : "👀"}
        </SpanTag>
    </TextField>

    <!-- <ATag is_link path="/forgot-password" sx="self-end mt-5">
        Forgot password
    </ATag> -->

    <Button sx="mt-5" type="submit">Log me in</Button>

    <PTag sx="mt-6">
        create account ?
        <ATag is_link path="/create-account">create account</ATag>
    </PTag>
</form>
