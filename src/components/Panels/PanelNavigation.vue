<template>
    <section class="panel-navigation">
        <div class="brand">
            <span>WebTrax</span>
            <span>Web-based Habbo Trax</span>
        </div>

        <div class="meta">
            <span>{{ trackMeta.title }}</span>
            <span>{{ trackMeta.artist }}</span>
        </div>

        <TraxButton
            mdi="pencil"
            color="transparent"
        />

        <div class="spacer"></div>

        <nav>
            <TraxButton
                mdi="folder-open"
            />
            <TraxButton
                mdi="content-save"
            />
            <TraxButton
                mdi="export-variant"
                color="primary"
            />
        </nav>
    </section>
</template>

<script setup>
import TraxButton from "@/components/TraxButton.vue";

defineProps({
    trackMeta: {
        type: Object,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
.panel-navigation {
    border-bottom: 1px solid rgba(255,255,255,0.14);
    display: grid;
    grid-template-columns: auto auto auto 1fr auto;
    align-items: center;

    & .brand {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 15px;

        & span:nth-child(1) {
            font-weight: 700;
            font-size: 1.1em;
        }
        & span:nth-child(2) {
            font-size: 0.75em;
            color: rgba(255,255,255,0.4);
        }
    }
    & .meta {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 15px;

        & span:nth-child(1) {
            font-size: 1em;
        }
        & span:nth-child(2) {
            font-size: 0.75em;
            color: rgba(255,255,255,0.4);
        }
    }
    & nav {
        display: flex;
        gap: 5px;
        padding: 15px;
    }
}
</style>
