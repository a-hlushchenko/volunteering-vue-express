<script setup lang="ts">
//компонент перевірки наявності дійсного токена у адміністратора

import { useRouter } from "vue-router";
import { checkAccess } from "../utils/checkAccess";
const router = useRouter();

import { getSession } from "../utils/session";
import { onMounted, ref } from "vue";

const token = getSession();

const isAdmin = ref(false);

function checkAdmin() {
  if (isAdmin.value) {
    router.push("/admin-proposes");
  }
}

onMounted(async () => {
  isAdmin.value = await checkAccess(token);
  checkAdmin();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
