<script setup lang="ts">
//сторінка пропозицій в адмінпанелі

import LayoutAdmin from "@/components/LayoutAdmin.vue";
import { ref, type Component, onMounted } from "vue";
import { getSession } from "../utils/session";
import PostsAdmin from "@/components/PostsAdmin.vue";
import Popup from "@/components/Popup.vue";
import type { Post } from "@/types/Post";
import { serverUrl } from "@/utils/serverUrl";

//змінні для керування станами
const error = ref("");
const loading = ref("");

const successPopup = ref(false);

//змінна для списку пропозицій
const proposeList = ref<Post[]>([]);

//отримання списку пропозицій
async function getList() {
  try {
    loading.value = "Отримання даних...";
    const res = await fetch(`${serverUrl}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locations: [],
        categories: [],
        typeId: 1,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      proposeList.value = data.postList;
      loading.value = "";
    } else {
      loading.value = "";
      error.value = data.message;
    }
  } catch (e) {
    loading.value = "";
    error.value = "Помилка отримання даних. Спробуйте оновити сторінку.";
  }
}

//видалення поста
async function deletePost(id: number) {
  try {
    loading.value = "Видалення...";
    const res = await fetch(`${serverUrl}/admin/deletepost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
        token: getSession(),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      openPopup();
      getList();
      loading.value = "";
    } else {
      loading.value = "";
      error.value = data.message;
    }
  } catch (e) {
    loading.value = "";
    error.value = "Помилка видалення.";
  }
}

//відкриття popup
function openPopup() {
  successPopup.value = true;

  document.addEventListener("click", () => {
    successPopup.value = false;
  });

  setTimeout(() => {
    successPopup.value = false;
    document.removeEventListener("click", () => {
      successPopup.value = false;
    });
  }, 5000);
}

//отримання даних при запуску сторінки
onMounted(() => {
  getList();
});
</script>

<template>
  <LayoutAdmin
    ><h1>Список пропозицій</h1>
    <span class="error" v-if="error">{{ error }}</span>
    <span class="loading" v-if="loading">{{ loading }}</span>
    <PostsAdmin :posts="proposeList" @delete="deletePost"></PostsAdmin>
    <Popup
      title="Видалено успішно!"
      text="Цього повідомлення більше не існує."
      :popup="successPopup"
  /></LayoutAdmin>
</template>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
