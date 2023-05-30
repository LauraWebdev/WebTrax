<template>
    <PanelNavigation
        :track-meta="trackMeta"
        @render-song="renderSong"
        @change-meta="changeMeta"
        @save-song="saveSong"
        @open-song="openSong"
    />

    <PanelLoadingSamples
        v-if="isLoadingSamples"
        :loading-progress="loadingProgress"
    />

    <PanelTools
        v-if="!isLoadingSamples"
        :is-playing="isPlaying"
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
        v-if="!isLoadingSamples"
        :is-playing="isPlaying"
        :song-position="songPosition"
        :track-length="trackLength"
        :track-nodes="trackNodes"
        :selected-c-d="selectedCD"
        :selected-sample="selectedSample"
        :selected-tool="selectedTool"
        @add-track="addTrack"
        @remove-track="removeTrack"
        @seek-position="seekPosition"
        @click-cell="clickCell"
    />

    <PanelStatus
        v-if="!isLoadingSamples"
    />

    <OverlayExportImport
        :active="overlayActiveImportExport"
        :data="importExportData"
        @close="() => { overlayActiveImportExport = false; }"
        @change="importSong"
    />
</template>

<script setup>
import PanelNavigation from "@/components/Panels/PanelNavigation.vue";
import PanelStatus from "@/components/Panels/PanelStatus.vue";
import PanelTools from "@/components/Panels/PanelTools.vue";
import {onMounted, ref} from "vue";
import PanelTimeline from "@/components/Panels/PanelTimeline.vue";
import toWav from 'audiobuffer-to-wav';
import trax_database from "@/trax_database";
import PanelLoadingSamples from "@/components/Panels/PanelLoadingSamples.vue";
import OverlayExportImport from "@/components/Overlays/OverlayExportImport.vue";

const trackMeta = ref({ title: 'Untitled Trax Song', artist: 'Unknown Artist'});
const trackLength = ref(20);
const trackNodes = ref([[], [], [], []]);

const selectedTool = ref('place');
const selectedCD = ref(3);
const selectedSample = ref(1);

const overlayActiveImportExport = ref(false);
const importExportData = ref('');
const isLoadingSamples = ref(false);
const loadingProgress = ref(0);
const sampleBuffers = ref({});
const audioContext = ref(null);
const songPlayPosition = ref(0);
const songPosition = ref(0);
const isPlaying = ref(false);
const sourceNodes = ref([]);
const positionInterval = ref(null);

onMounted(async () => {
    document.addEventListener('keydown', (event) => {
        if(event.shiftKey) {
            selectedTool.value = 'remove';
        }
        if(event.ctrlKey) {
            selectedTool.value = 'picker';
        }
    });
    document.addEventListener('keyup', (event) => {
        if(!event.shiftKey && !event.ctrlKey) {
            selectedTool.value = 'place';
        }
    });

    console.log("[App] Buffering");
    isLoadingSamples.value = true;

    audioContext.value = new AudioContext();

    for (const cd of trax_database) {
        for (const sample of cd.samples) {
            let url = `./trax/audio/${cd.cd}_${sample.sample}.mp3`;
            sampleBuffers.value[url] = await loadAudioAsBuffer(url);
            loadingProgress.value++;
        }
    }

    isLoadingSamples.value = false;
    console.log("[App] Buffering done");
});

const loadAudioAsBuffer = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.value.decodeAudioData(arrayBuffer);
}
const createSourceNode = (_audioContext, _audioBuffer, _position, _length) => {
    const sourceNode = _audioContext.createBufferSource();
    sourceNode.buffer = _audioBuffer;
    sourceNode.start(_audioContext.currentTime + _position);
    sourceNode.stop(_audioContext.currentTime + _position + _length);
    return sourceNode;
}

const changeTool = (_tool) => {
    selectedTool.value = _tool;
};
const changeCD = (_CD) => {
    selectedCD.value = _CD;
};
const changeSample = (_sample) => {
    selectedSample.value = _sample;
};

const changeMeta = (_title, _artist) => {
    trackMeta.value.title = _title;
    trackMeta.value.artist = _artist;
};

const playSong = () => {
    isPlaying.value = true;

    audioContext.value = new AudioContext();
    songPlayPosition.value = songPosition.value - 0.1;

    console.log("[App] Playing");

    addSourceNodesToAudioContext(audioContext.value);

    positionInterval.value = setInterval(() => {
        songPosition.value = songPlayPosition.value + audioContext.value.currentTime;

        if(songPosition.value > trackLength.value) {
            stopSong();
        }
    }, 50);
};
const stopSong = () => {
    isPlaying.value = false;

    clearInterval(positionInterval.value);
    songPosition.value = songPlayPosition.value + 0.1;

    sourceNodes.value.forEach(sourceNode => { sourceNode.stop(); sourceNode.disconnect(); });
    sourceNodes.value = [];
};

const saveSong = () => {
    importExportData.value = JSON.stringify({
        meta: trackMeta.value,
        tracks: trackNodes.value,
        length: trackLength.value,
    });

    overlayActiveImportExport.value = true;
};
const openSong = (_data) => {
    importExportData.value = '';
    overlayActiveImportExport.value = true;
};
const importSong = (_data) => {
    overlayActiveImportExport.value = false;

    importExportData.value = _data;
    let parsedData = JSON.parse(importExportData.value);

    // TODO: Sanity Checks
    trackMeta.value = parsedData.meta;
    trackNodes.value = parsedData.tracks;
    trackLength.value = parsedData.length;
};

const addTrack = () => {
    trackNodes.value.push([]);
};

const removeTrack = (_index) => {
    trackNodes.value.splice(_index, 1);
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
        case 'picker':
            pickNode(_track, _cell);
            break;
    }
};

const removeNode = (_track, _cell) => {
    let track = trackNodes.value[_track];
    let existingItem = track.findIndex(x => x.position === _cell - 1);

    if(existingItem !== -1) {
        track.splice(existingItem, 1);
    }
};
const pickNode = (_track, _cell) => {
    let track = trackNodes.value[_track];
    let existingItem = track.find(x => x.position === _cell - 1);

    if(existingItem) {
        selectedCD.value = existingItem.cd;
        selectedSample.value = existingItem.sample;
    }
};
const addNode = (_track, _cell) => {
    let selectedSampleLength = getSampleLength(selectedCD.value, selectedSample.value);
    let track = trackNodes.value[_track];

    let itemsToRemove = [];

    // Remove overlapping items
    for(let i = -1; i < selectedSampleLength - 1; i++) {
        let forwardCellCheck = track.findIndex(x => x.position === _cell + i);

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
        position: _cell - 1,
    });

    // Extend Track if longer
    trackLength.value = Math.max(trackLength.value, _cell + selectedSampleLength);
};

const addSourceNodesToAudioContext = (_audioContext) => {
    sourceNodes.value.forEach(sourceNode => { sourceNode.stop(); sourceNode.disconnect(); });
    sourceNodes.value = [];

    trackNodes.value.forEach((track) => {
        track.forEach(sample => {
            let url = `./trax/audio/${sample.cd}_${sample.sample}.mp3`;
            let offset = sample.position - songPlayPosition.value;
            if(offset > 0) {
                sourceNodes.value.push(createSourceNode(_audioContext, sampleBuffers.value[url], offset, getSampleLength(sample.cd, sample.sample)));
            }
        });
    });

    sourceNodes.value.forEach(sourceNode => sourceNode.connect(_audioContext.destination));
}
const getSampleLength = (_cd, _sample) => {
    return trax_database.find(x => x.cd === _cd)?.samples.find(x => x.sample === _sample)?.length * 2 ?? 1;
};

const renderSong = async () => {
    console.log("[App] Rendering");

    let offlineAudioContext = new OfflineAudioContext({
        numberOfChannels: audioContext.value.channelCount,
        length: trackLength.value * audioContext.value.sampleRate,
        sampleRate: audioContext.value.sampleRate,
    });

    addSourceNodesToAudioContext(offlineAudioContext);

    const renderedBuffer = await offlineAudioContext.startRendering();
    const renderedWav = toWav(renderedBuffer);
    const blob = new window.Blob([ new DataView(renderedWav) ], {
        type: 'audio/wav'
    });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.style.display = "none";
    anchor.href = url;
    anchor.download = 'audio.wav';
    anchor.click();
    document.body.appendChild(anchor);
    window.URL.revokeObjectURL(url);

    console.log("[App] Rendering Done");
};
</script>

<style lang="scss">
#app {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    height: 100%;
    user-select: none;
}
</style>
