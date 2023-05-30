<template>
  <dialog ref="DOMOverlayCDs">
    <header>Select a CD</header>
    <main>
      <TraxButton
        v-for="cd in trax_database"
        :key="cd.cd"
        :icon="`./trax/images/${cd.cd}.gif`"
        :label="cd.meta.title"
        :sublabel="cd.meta.artist"
        :color="inputSelectedCD === cd.cd ? 'bright' : 'default'"
        align="left"
        @click="inputSelectedCD = cd.cd"
      />
    </main>
    <section class="actions">
      <TraxButton
        label="Close"
        color="transparent"
        @click="emit('close')"
      />
      <TraxButton
        label="Select"
        @click="() => { emit('change', inputSelectedCD); }"
      />
    </section>
  </dialog>
</template>

<script setup>
import {ref, watch} from "vue";
import TraxButton from "@/components/TraxButton.vue";
import trax_database from "../../trax_database";

const emit = defineEmits(['close', 'change']);

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    selectedCD: {
        type: Number,
        default: 1,
    },
});

const DOMOverlayCDs = ref(null);

const inputSelectedCD = ref(props.selectedCD);

watch(() => props.active, (value) => {
    if(value) {
        DOMOverlayCDs.value.showModal();
    } else {
        DOMOverlayCDs.value.close();
    }

    inputSelectedCD.value = props.selectedCD;
});
</script>

<style lang="scss" scoped>
dialog {
    border: 1px solid rgba(255,255,255,0.14);
    background: #222;
    color: #fff;
    border-radius: 6px;
    padding: 0;
    width: calc(100% - 50px);
    max-width: 700px;
    max-height: calc(100% - 50px);
    grid-template-rows: auto 1fr auto;

    &[open] {
        display: grid;
    }

    &::backdrop {
        background: rgba(0,0,0,0.6);
    }

    & header {
        font-weight: 700;
        font-size: 1.1em;
        padding: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.14);
    }
    & main {
        padding: 15px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.14);
        overflow-y: scroll;
    }
    & .actions {
        display: flex;
        padding: 15px;
        gap: 10px;
        justify-content: flex-end;
    }
}
</style>
