<template>
  <dialog ref="DOMOverlayMeta">
    <header>Metadata</header>
    <main>
      <TraxInput
        label="Title"
      >
        <input
          v-model="inputTitle"
          type="text"
        >
      </TraxInput>
      <TraxInput
        label="Artist"
      >
        <input
          v-model="inputArtist"
          type="text"
        >
      </TraxInput>
    </main>
    <section class="actions">
      <TraxButton
        label="Close"
        color="transparent"
        @click="emit('close')"
      />
      <TraxButton
        label="Save"
        mdi="content-save"
        @click="() => { emit('change', inputTitle, inputArtist); }"
      />
    </section>
  </dialog>
</template>

<script setup>
import {ref, watch} from "vue";
import TraxButton from "@/components/TraxButton.vue";
import TraxInput from "@/components/TraxInput.vue";

const emit = defineEmits(['close', 'change']);

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    artist: {
        type: String,
        default: "",
    },
});

const DOMOverlayMeta = ref(null);

const inputTitle = ref(props.title);
const inputArtist = ref(props.artist);

watch(() => props.active, (value) => {
    if(value) {
        DOMOverlayMeta.value.showModal();
    } else {
        DOMOverlayMeta.value.close();
    }

    inputTitle.value = props.title;
    inputArtist.value = props.artist;
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
    max-width: 500px;

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
        gap: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.14);
    }
    & .actions {
        display: flex;
        padding: 15px;
        gap: 10px;
        justify-content: flex-end;
    }
}
</style>
