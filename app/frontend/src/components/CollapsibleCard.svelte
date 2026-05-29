<style lang="scss">
    .collapsible-card {
    }
</style>

<div class="collapsible-card ui-card">
    <div class="collapsible-card__header">
        {#if header}
            {@render header()}
        {/if}
    </div>
    <div class="collapsible-card__body">
        {#if children}
            {@render children()}
        {/if}
    </div>
</div>

<script lang="ts">
    const { header, children }: { header: Snippet; children: Snippet} = $props();
</script>