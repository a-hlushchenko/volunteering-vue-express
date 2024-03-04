<script setup lang="ts">
//компонент для popup

import { ref } from "vue";

defineProps<{
  title: string;
  text: string;
  popup: boolean;
}>();
</script>

<template>
  <div class="popup-wrapper" :class="{ active: popup }">
    <div class="popup">
      <strong class="popup-title">{{ title }}</strong>
      <p class="popup-text">{{ text }}</p>
    </div>
  </div>
</template>

<style scoped>
.popup-wrapper {
  z-index: 4;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00000020;
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.4s;
}

.popup-wrapper.active {
  opacity: 1;
}

.popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background-color: #fff;
  max-width: 500px;
  border-radius: 12px;
}

.popup-title {
  color: hsla(160, 100%, 37%, 1);
  font-size: 24px;
}
</style>
