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
      :disabled="isLoadingSamples"
      @click="() => { overlayActiveTrackMeta = true; }"
    />

    <div class="spacer" />

    <nav>
      <TraxButton
        mdi="folder-open"
        :disabled="isLoadingSamples"
        @click="emit('openSong')"
      />
      <TraxButton
        mdi="content-save"
        :disabled="isLoadingSamples"
        @click="emit('saveSong')"
      />
      <TraxButton
        mdi="export-variant"
        color="primary"
        :disabled="isLoadingSamples"
        @click="emit('renderSong')"
      />
    </nav>
  </section>

  <OverlayMeta
    :active="overlayActiveTrackMeta"
    :title="trackMeta.title"
    :artist="trackMeta.artist"
    @close="() => { overlayActiveTrackMeta = false; }"
    @change="(_title, _artist) => { overlayActiveTrackMeta = false; emit('changeMeta', _title, _artist) }"
  />
</template>

<script setup>
import TraxButton from "@/components/TraxButton.vue";
import OverlayMeta from "@/components/Overlays/OverlayMeta.vue";
import {ref} from "vue";

const emit = defineEmits(['openSong', 'saveSong', 'renderSong', 'changeMeta']);

defineProps({
    isLoadingSamples: {
        type: Boolean,
        default: false,
    },
    trackMeta: {
        type: Object,
        required: true,
    },
});

const overlayActiveTrackMeta = ref(false);
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
