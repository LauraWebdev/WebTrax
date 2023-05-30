<template>
    <PanelNavigation
        :track-meta="trackMeta"
    />

    <PanelTools
        :is-playing="isPlaying"
        :selected-nodes="selectedNodes"
        :selected-tool="selectedTool"
        :selected-c-d="selectedCD"
        :selected-sample="selectedSample"
        @play-song="playSong"
        @stop-song="stopSong"
        @change-tool="changeTool"
        @change-c-d="changeCD"
        @change-sample="changeSample"
    />

    <PanelTimeline
        :song-position="songPosition"
        :track-legnth="trackLength"
        :track-nodes="trackNodes"
        :selected-c-d="selectedCD"
        :selected-sample="selectedSample"
        :selected-tool="selectedTool"
        @add-track="addTrack"
        @seek-position="seekPosition"
        @click-cell="clickCell"
    />

    <PanelStatus
        :selected-nodes="selectedNodes"
    />
</template>

<script setup>
import PanelNavigation from "@/components/Panels/PanelNavigation.vue";
import PanelStatus from "@/components/Panels/PanelStatus.vue";
import PanelTools from "@/components/Panels/PanelTools.vue";
import {ref} from "vue";
import PanelTimeline from "@/components/Panels/PanelTimeline.vue";
import trax_database from "@/trax_database";

const trackMeta = ref({ title: 'Untitled Trax Song', artist: 'Unknown Artist'});
const trackLength = ref(20);
const trackNodes = ref([[{pos: 3, sample: 1, cd: 3}], [], [{pos: 3, sample: 2, cd: 3}, {pos: 5, sample: 2, cd: 3}], []]);
const selectedNodes = ref([]);

const selectedTool = ref('place');
const selectedCD = ref(3);
const selectedSample = ref(1);

const isPlaying = ref(false);
const songTimer = ref(null);
const songPlayPosition = ref(0);
const songPosition = ref(0);

const changeTool = (_tool) => {
    selectedTool.value = _tool;
};
const changeCD = (_CD) => {
    selectedCD.value = _CD;
};
const changeSample = (_sample) => {
    selectedSample.value = _sample;
};

const playSong = () => {
    isPlaying.value = true;

    songPlayPosition.value = songPosition.value;

    songPosition.value -= 0.1;

    songTimer.value = setInterval(() => songTick(), 100);
};
const stopSong = () => {
    isPlaying.value = false;
    songPosition.value = songPlayPosition.value;

    clearInterval(songTimer.value);
};

// TODO: Rewrite this with Scheduled AudioContext
const songTick = () => {
    let newPosition = songPosition.value + 0.1;
    songPosition.value = parseFloat(newPosition.toFixed(2));

    trackNodes.value.forEach(track => {
        track.forEach(node => {
            if(node.pos === songPosition.value) {
                let audioRef = new Audio(`/trax/audio/${node.cd}_${node.sample}.mp3`);
                audioRef.play();
            }
        });
    });
};

const addTrack = () => {
    trackNodes.value.push([]);
};

const seekPosition = (_newPos) => {
    songPosition.value = Math.max(0, _newPos / 40);
};

const clickCell = (_track, _cell) => {
    switch(selectedTool.value) {
        default:
        case 'place':
            addNode(_track, _cell);
            break;
        case 'remove':
            removeNode(_track, _cell);
            break;
    }
};

const removeNode = (_track, _cell) => {
    let track = trackNodes.value[_track];
    let existingItem = track.findIndex(x => x.pos === _cell - 1);

    if(existingItem !== -1) {
        track.splice(existingItem, 1);
    }
};
const addNode = (_track, _cell) => {
    let selectedSampleLength = getSampleLength(selectedCD.value, selectedSample.value);
    let track = trackNodes.value[_track];

    let itemsToRemove = [];

    // Remove overlapping items
    for(let i = -1; i < selectedSampleLength - 1; i++) {
        let forwardCellCheck = track.findIndex(x => x.pos === _cell + i);

        // TODO: This does not account for items that are before the clicked cell and are longer than 1

        if(forwardCellCheck !== -1) {
            itemsToRemove.push(track.indexOf(forwardCellCheck));
        }
    }

    itemsToRemove.forEach(item => {
        track.splice(item, 1);
    })

    // Add new item
    trackNodes.value[_track].push({
        cd: selectedCD.value,
        sample: selectedSample.value,
        pos: _cell - 1,
    });
};

const getSampleLength = (_cd, _sample) => {
    return trax_database.find(x => x.cd === _cd)?.samples.find(x => x.sample === _sample)?.length * 2 ?? 1;
}
</script>

<style lang="scss">
#app {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    height: 100%;
    user-select: none;
}
</style>
