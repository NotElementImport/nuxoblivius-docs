<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from "vue";

const props = defineProps<{ alt?: boolean }>();

const elementTrack = shallowRef();
const cssCode = shallowRef(`nx-container appear ${props.alt ? "alt" : ""}`);

var inter: IntersectionObserver;

onMounted(() => {
  inter = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        cssCode.value = `nx-container appear ${props.alt ? "alt" : ""} show`;
        inter.disconnect();
      }
    },
    { threshold: 0.2 },
  );

  setTimeout(() => {
    inter.observe(elementTrack.value);
  }, 500);

  onUnmounted(() => {
    inter.disconnect();
  });
});
</script>
<template>
  <section ref="elementTrack" :class="cssCode">
    <slot />
  </section>
</template>
