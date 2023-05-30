<template>
  <section class="panel-tools">
    <nav>
      <TraxButton
        v-if="!isPlaying"
        mdi="play"
        label="Play"
        color="success"
        @click="playSong"
      />
      <TraxButton
        v-if="isPlaying"
        mdi="stop"
        label="Stop"
        color="danger"
        @click="stopSong"
      />
    </nav>

    <nav>
      <TraxButton
        mdi="music-note-plus"
        :color="selectedTool === 'place' ? 'bright' : 'transparent'"
        :disabled="isPlaying"
        @click="selectTool('place')"
      />
      <TraxButton
        mdi="music-note-minus"
        :color="selectedTool === 'remove' ? 'bright' : 'transparent'"
        :disabled="isPlaying"
        @click="selectTool('remove')"
      />
      <TraxButton
        mdi="eyedropper"
        :color="selectedTool === 'picker' ? 'bright' : 'transparent'"
        :disabled="isPlaying"
        @click="selectTool('picker')"
      />
    </nav>

    <nav>
      <TraxButton
        :icon="`./trax/images/${selectedCD}.gif`"
        :label="cdTitle"
        :sublabel="cdArtist"
        :disabled="isPlaying"
        @click="overlayActiveCDs = true"
      />
      <TraxButton
        v-for="i in 9"
        :key="i"
        :mdi="getIcon(i)"
        :color="selectedSample === i ? 'bright' : 'default'"
        :disabled="isPlaying"
        @click="selectSample(i)"
        @mouseenter="playSample(i)"
        @mouseleave="stopSample"
      />
    </nav>
  </section>

  <OverlayCDs
    :active="overlayActiveCDs"
    :selected-c-d="selectedCD"
    @close="() => { overlayActiveCDs = false; }"
    @change="(_selectedCD) => { overlayActiveCDs = false; emit('changeCD', _selectedCD) }"
  />
</template>

<script setup>
import TraxButton from "@/components/TraxButton.vue";
import {computed, ref} from "vue";
import {getCDArtist, getCDTitle} from "@/trax_database";
import OverlayCDs from "@/components/Overlays/OverlayCDs.vue";

const emit = defineEmits(['playSong', 'stopSong', 'changeSample', 'changeCD', 'changeTool']);

const props = defineProps({
    isPlaying: {
        type: Boolean,
        default: false,
    },
    selectedTool: {
        type: String,
        default: 'place',
    },
    selectedCD: {
        type: Number,
        default: 3,
    },
    selectedSample: {
        type: Number,
        default: 1,
    },
});

const previewAudio = ref(null);
const overlayActiveCDs = ref(false);

const selectTool = (_tool) => {
    emit('changeTool', _tool);
};
const selectSample = (_sample) => {
    emit('changeSample', _sample);
};

const playSample = (_sample) => {
    if(previewAudio.value !== null) {
        previewAudio.value.pause();
        previewAudio.value.currentTime = 0;
    }

    previewAudio.value = new Audio(`./trax/audio/${props.selectedCD}_${_sample}.mp3`);
    previewAudio.value.play();
};
const stopSample = () => {
    if(previewAudio.value === null) return;

    previewAudio.value.pause();
    previewAudio.value.currentTime = 0;
};

const playSong = () => {
    emit('playSong');
};
const stopSong = () => {
    emit('stopSong');
};

const cdTitle = computed(() => {
    return getCDTitle(props.selectedCD);
});
const cdArtist = computed(() => {
    return getCDArtist(props.selectedCD);
});

const getIcon = (_sampleId) => {
    switch(_sampleId) {
        case 1:
            return 'circle-outline';
        case 2:
            return 'checkbox-blank-outline';
        case 3:
            return 'rhombus-outline';
        case 4:
            return 'chevron-left';
        case 5:
            return 'infinity';
        case 6:
            return 'multiplication';
        case 7:
            return 'equal';
        case 8:
            return 'close';
        case 9:
            return 'cards-heart-outline';
    }
};
</script>

<style lang="scss" scoped>
.panel-tools {
    border-bottom: 1px solid rgba(255,255,255,0.14);
    display: flex;

    & nav {
        padding: 5px;
        display: flex;
        gap: 5px;
        border-right: 1px solid rgba(255,255,255,0.14);
    }
}
</style>
