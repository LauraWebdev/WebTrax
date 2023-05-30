<template>
  <dialog ref="DOMOverlayImportExport">
    <header>Export & Import</header>
    <main>
      <TraxInput
        label="Data"
      >
        <textarea
          v-model="inputData"
          rows="10"
        />
      </TraxInput>
    </main>
    <section class="actions">
      <TraxButton
        label="Close"
        color="transparent"
        @click="emit('close')"
      />
      <TraxButton
        label="Import"
        mdi="content-save"
        @click="() => { emit('change', inputData); }"
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
    data: {
        type: String,
        default: "",
    },
});

const DOMOverlayImportExport = ref(null);

const inputData = ref(props.data);

watch(() => props.active, (value) => {
    if(value) {
        DOMOverlayImportExport.value.showModal();
    } else {
        DOMOverlayImportExport.value.close();
    }

    inputData.value = props.data;
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
