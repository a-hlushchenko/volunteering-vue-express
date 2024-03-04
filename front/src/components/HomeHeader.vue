<script setup lang="ts">
//компонент хедеру

import { ref } from "vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="header">
    <RouterLink to="/"
      ><img src="/img/logo.png" loading="lazy" alt="logo" class="navbar_logo"
    /></RouterLink>
    <RouterLink class="button" to="/admin-login">Адмінпанель</RouterLink>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 1320px;
  padding: 20px;
  margin: 0 auto;
}

img {
  max-width: 200px;
}

.button {
  padding: 8px 16px;
  color: #fff;
  background-color: #2178c0;
  width: fit-content;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.4s;
}

.button:hover {
  background-color: #1a5e96;
}
</style>
