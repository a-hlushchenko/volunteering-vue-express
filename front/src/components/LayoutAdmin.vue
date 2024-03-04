<script setup lang="ts">
//обгортка сторінок адмінпанелі

import { useRouter } from "vue-router";
import ProviderAdmin from "../components/ProviderAdmin.vue";
const router = useRouter();
</script>

<template>
  <ProviderAdmin>
    <div class="page">
      <RouterLink to="/"
        ><img src="/img/icon.png" alt="getHelp" width="50" />
      </RouterLink>
      <div class="tab-buttons">
        <button class="tab-button" @click="router.push('/admin-proposes')">
          Пропозиції
        </button>
        <button class="tab-button" @click="router.push('/admin-requests')">
          Прохання
        </button>
        <button class="tab-button add" @click="router.push('/admin-add')">
          Додати
        </button>
      </div>
      <slot></slot>
    </div>
  </ProviderAdmin>
</template>

<style scoped>
.page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.tab-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tab-button {
  font-size: 18px;
  padding: 8px 24px;
  border-radius: 6px;
  background-color: #2178c0;
  color: #fff;
  border: 1px solid transparent;
  transition: background-color 0.4s, color 0.4s, border-color 0.4s;
}

.tab-button.add {
  background-color: hsla(160, 100%, 37%, 1);
  padding: 8px 24px;
  color: #fff;
  font-size: 18px;
  border-radius: 6px;
  text-decoration: none;
  font-family: unset;
}

.tab-button:hover {
  background-color: #1a5e96;
}
.tab-button.add:hover {
  background-color: hsla(160, 100%, 32%, 1);
}
.tab-button.active {
  background-color: #fff !important;
  border-color: #2178c0;
  color: #2178c0;
  cursor: default;
}
.tab-button.add.active {
  border-color: hsla(160, 100%, 32%, 1);
  color: hsla(160, 100%, 32%, 1);
}

@media (max-width: 450px) {
  .heading,
  .tab-buttons {
    gap: 8px;
  }

  .tab-button,
  .add-button {
    padding: 8px 16px;
  }
}

@media (max-width: 500px) {
  .page {
    padding: 12px;
  }
}
</style>
