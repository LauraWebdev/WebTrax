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
                @click="selectTool('place')"
                :disabled="isPlaying"
            />
            <TraxButton
                mdi="music-note-minus"
                :color="selectedTool === 'remove' ? 'bright' : 'transparent'"
                @click="selectTool('remove')"
                :disabled="isPlaying"
            />
            <TraxButton
                mdi="eyedropper"
                :color="selectedTool === 'picker' ? 'bright' : 'transparent'"
                @click="selectTool('picker')"
                :disabled="isPlaying"
            />
        </nav>

        <nav>
            <TraxButton
                :icon="`/trax/images/${selectedCD}.gif`"
                :label="cdTitle"
                :sublabel="cdArtist"
                @click="selectCD"
                :disabled="isPlaying"
            />
            <TraxButton
                v-for="i in 9"
                :mdi="`numeric-${i}`"
                :color="selectedSample === i ? 'bright' : 'default'"
                @click="selectSample(i)"
                @mouseenter="playSample(i)"
                @mouseleave="stopSample"
                :disabled="isPlaying"
            />
        </nav>
    </section>
</template>

<script setup>
import TraxButton from "@/components/TraxButton.vue";
import {computed, ref} from "vue";
import trax_database, {getCDArtist, getCDColor, getCDTitle} from "@/trax_database";

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

const selectTool = (_tool) => {
    emit('changeTool', _tool);
};
const selectCD = () => {
    // TODO: Open Overlay
    let newCD = Math.floor(Math.random() * 72) + 1;
    emit('changeCD', newCD);
};
const selectSample = (_sample) => {
    emit('changeSample', _sample);
};

const playSample = (_sample) => {
    if(previewAudio.value !== null) {
        previewAudio.value.pause();
        previewAudio.value.currentTime = 0;
    }

    previewAudio.value = new Audio(`/trax/audio/${props.selectedCD}_${_sample}.mp3`);
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
const cdColor = computed(() => {
    return getCDColor(props.selectedCD);
});
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
