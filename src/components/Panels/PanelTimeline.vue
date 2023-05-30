<template>
    <section class="panel-timeline">
        <div class="playhead"
             :style="`left: ${150 + songPosition * 40}px`"
        >
            <div v-show="!isPlaying" class="dragarea" ref="DOMPlayhead"></div>
            <div class="knob"
                :class="{'active' : isDragging}"
            ></div>
        </div>
        <div class="grid">
            <span>Track</span>
            <span
                v-for="i in trackLength"
            >
                {{ i }}
            </span>
        </div>
        <div class="timeline">
            <div
                v-for="(nodes, trackI) in trackNodes"
                :key="trackI"
                class="track"
            >
                <div class="controls">
                    <span>Track #{{ trackI }}</span>
                    <div>
                        <TraxButton
                            v-if="trackI > 0"
                            mdi="trash-can"
                            color="danger"
                            mini
                            @click="emit('removeTrack', trackI)"
                        />
                    </div>
                </div>
                <div class="nodes">
                    <span
                        v-for="i2 in trackLength"
                        class="cell"
                        @mouseenter="cellEnter(trackI, i2)"
                        @mouseout="cellOut(trackI, i2)"
                        @click="isPlaying ? false : emit('clickCell', trackI, i2)"
                    >
                        <template
                            v-for="node in [nodes.find(x => x.pos === i2 - 1)]"
                        >
                            <span
                                v-if="node"
                                class="node"
                                :style="`width: ${getNodeLength(node.cd, node.sample) * 25 + (getNodeLength(node.cd, node.sample) - 1) * 15}px; background: ${ getCDColor(node.cd) };`"
                            >{{ node.sample }}</span>
                        </template>
                        <span
                            class="node-ghost"
                            v-if="activeTrack === trackI && activeCell === i2 && selectedTool === 'place' && !isPlaying"
                            :style="`width: ${getNodeLength(selectedCD, selectedSample) * 25 + (getNodeLength(selectedCD, selectedSample) - 1) * 15}px; opacity: 0.3; background: ${ getCDColor(selectedCD) };`"
                        ></span>
                    </span>
                </div>
            </div>
        </div>

        <div class="actions">
            <TraxButton
                mdi="plus"
                label="Add Track"
                color="bright"
                @click="emit('addTrack')"
            />
        </div>
    </section>
</template>

<script setup>
import TraxButton from "@/components/TraxButton.vue";
import {onMounted, ref} from "vue";
import trax_database, {getCDColor} from "@/trax_database";

const emit = defineEmits(['addTrack', 'removeTrack', 'seekPosition', 'clickCell']);

const props = defineProps({
    isPlaying: {
        type: Boolean,
        default: false,
    },
    songPosition: {
        type: Number,
        default: 0,
    },
    trackLength: {
        type: Number,
        default: 20,
    },
    trackNodes: {
        type: Array,
        default: () => [],
    },
    selectedTool: {
        type: String,
        default: 'cursor',
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

const DOMPlayhead = ref(null);
const isDragging = ref(false);
const activeTrack = ref(null);
const activeCell = ref(null);

onMounted(() => {
    DOMPlayhead.value.addEventListener('mousedown', () => {
        isDragging.value = true;
    });
    document.addEventListener('mousemove', (event) => {
        if(isDragging.value) {

            let snappedPosition = (Math.min(Math.round((event.clientX - 150) / 40), props.trackLength) * 40);
            emit('seekPosition', snappedPosition);
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging.value = false;
    });
});

const cellEnter = (_track, _cell) => {
    activeTrack.value = _track;
    activeCell.value = _cell;
};

const cellOut = (_track, _cell) => {
    activeTrack.value = null;
    activeCell.value = null;
};

const getNodeLength =(_cd, _sample) => {
    return trax_database.find(x => x.cd === _cd)?.samples.find(x => x.sample === _sample)?.length * 2 ?? 1;
};
</script>

<style lang="scss" scoped>
.panel-timeline {
    border-bottom: 1px solid rgba(255,255,255,0.14);
    overflow: auto;
    position: relative;

    & .playhead {
        background: rgb(var(--colorPrimary));
        height: 100%;
        width: 1px;
        top: 0;
        left: 150px;
        position: absolute;

        & .knob {
            width: 10px;
            height: 10px;
            background: rgb(var(--colorPrimary));
            border-radius: 20px;
            position: absolute;
            left: -5px;
            top: -5px;
            transition: 0.2s ease-in-out all;

            &.active {
                width: 20px;
                height: 20px;
                left: -10px;
                top: -10px;
            }
        }
        & .dragarea {
            width: 50px;
            height: 50px;
            position: absolute;
            left: -25px;
            top: -25px;
        }
    }

    & .grid {
        display: flex;
        border-bottom: 1px solid rgba(255,255,255,0.14);
        background: #111;

        & span {
            flex-shrink: 0;
            width: 40px;
            text-align: center;
            border-right: 1px solid rgba(255,255,255,0.14);
            padding: 5px;
            font-weight: 700;
            font-size: 0.65rem;

            &:first-child {
                width: 150px;
            }
            &:not(:first-child) {
                text-align: right;
            }
        }
    }
    & .timeline {
        display: grid;

        & .track {
            border-bottom: 1px solid rgba(255,255,255,0.14);
            height: 45px;
            display: grid;
            grid-template-columns: 150px 1fr;

            & .controls {
                border-right: 1px solid rgba(255,255,255,0.14);
                display: grid;
                grid-template-columns: 1fr auto;
                align-items: center;
                padding: 0 10px;
                font-size: 0.75rem;
            }
            & .nodes {
                align-items: center;
                display: flex;

                & .cell {
                    width: 40px;
                    height: 45px;
                    text-align: center;
                    border-right: 1px solid rgba(255,255,255,0.14);
                    font-weight: 700;
                    font-size: 0.75rem;
                    padding: 10px 7px;
                    position: relative;

                    & .node {
                        position: absolute;
                        z-index: 10;
                        height: 25px;
                        background: rgb(var(--colorPrimary));
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    & .node-ghost {
                        position: absolute;
                        z-index: 10;
                        min-width: 25px;
                        height: 25px;
                        background: rgba(var(--colorPrimary), 0.1);
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: none;
                    }
                }
            }
        }
    }
    & .actions {
        padding: 30px;
        display: flex;
        justify-content: center;
    }
}
</style>