<template>
  <section class="panel-loading-samples">
    <div class="content">
      <TraxLoader />
      <h1>Loading Samples ({{ loadingProgress }}%)</h1>
      <p>Please wait...</p>
    </div>
  </section>
</template>

<script setup>
import TraxLoader from "@/components/TraxLoader.vue";

defineProps({
    loadingProgress: {
        type: Number,
        default: 0,
    },
});
</script>

<style lang="scss" scoped>
.panel-loading-samples {
    grid-row: 2 / span 3;
    display: flex;
    align-items: center;
    justify-content: center;

    & .content {
        display: grid;
        gap: 5px;
        justify-items: center;

        & h1 {
            font-weight: 500;
        }
        & p {
            color: rgba(255,255,255,0.4);
        }
    }
}
</style>