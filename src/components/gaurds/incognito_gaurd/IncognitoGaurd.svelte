<script lang="ts">
    import { page } from '$app/stores';
    import ATag from '$components/atoms/A_Tag.svelte';
    import DivTag from '$components/atoms/Div_Tag.svelte';
    import PTag from '$components/atoms/P_Tag.svelte';
    import SpanTag from '$components/atoms/SpanTag.svelte';
    import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-svelte';

    // Set to true fo fetch data when component is mounted

    const { getData, data: visitor_data, isLoading, error } = useVisitorData({ extendedResult: true }, { immediate: true });

    const openAdminContact = () => {
        const newTab = window.open("https://github.com/RashJrEdmund", "_blank");
    }
    
    $: incognitor_active = false;

    $: loading = true;

    $: apiStartedLoading = false;

    $: current_user = $page.data?.current_user || null;

    $: (() => {
        if ($isLoading) {
            apiStartedLoading = true;
        }

        if ($visitor_data)  {
            incognitor_active = $visitor_data.incognito
        }

        loading = (!$isLoading && apiStartedLoading) ? false : true;

        // console.log('isloading', { isLoading: $isLoading, loading, apiStartedLoading, current_user })
    })()
</script>

{#if incognitor_active}
    <PTag>
        This <SpanTag success>service</SpanTag> is not avalaible on your
        <SpanTag pink_alert>current browser mode</SpanTag>
    </PTag>
{:else}
    {#if loading}
        <SpanTag success>Loading service...</SpanTag>
    {:else}
        {#if $visitor_data || current_user}
            <slot />
        {:else}
            <DivTag
                class="bg-none flex flex-col items-start justify-start gap-2 p-2"
            >
                <SpanTag success>If you are seeing this message, then an API KEY</SpanTag>
                <SpanTag success>of an important API used by this app is expired</SpanTag>
                <SpanTag success>I also cannot allow you shortening links without logging in or signing up</SpanTag>
                <SpanTag success>
                    If you wanna shorten links without authenticating your self, please contact the admins
                    <ATag pink_alert path="https://github.com/RashJrEdmund" target="_blank">here</ATag>
                    so we could update our API keys
                </SpanTag>
            </DivTag>
        {/if}
    {/if}
{/if}