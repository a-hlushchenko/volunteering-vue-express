<script setup lang="ts">
//головна сторінка

import HomeHeader from "../components/HomeHeader.vue";
import ProposeSection from "../components/ProposeSection.vue";
import FormSection from "../components/FormSection.vue";
</script>

<template>
  <main class="main-wrapper">
    <HomeHeader />
    <FormSection />
    <ProposeSection />
  </main>
</template>

<style scoped>
.main-wrapper {
  background-color: #000;
}
</style>
