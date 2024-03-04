<script setup lang="ts"></script>

<template>
  <RouterView />
</template>

<style>
:root {
  scroll-behavior: smooth;
}

.error {
  color: red;
}

body {
  font-family: "Roboto", sans-serif;
}

::-webkit-scrollbar-track {
  background: #fff;
}

::-webkit-scrollbar-thumb {
  background: #2178c0;
  border-radius: 50px;
}

::-webkit-scrollbar {
  width: 6px;
  height: 80%;
}
</style>
