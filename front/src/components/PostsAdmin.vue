<script setup lang="ts">
//компонент постів в адмінпанелі

import { nextTick, ref, watch, watchEffect } from "vue";
import type { Post } from "@/types/Post";
import Popup from "./Popup.vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps<{ posts: Post[] }>();
const emit = defineEmits(["delete"]);

const popup = ref<{ active: boolean; postId: number | null; name: string }>({
  active: false,
  postId: null,
  name: "",
});

//посилання на елемент popup
const refPopup = ref<HTMLElement | null>(null);

//відкриття popup
function openPopup({ postId, name }: { postId: number; name: string }) {
  popup.value = { postId, name, active: true };
  setTimeout(() => {
    document.addEventListener("click", popupListener);
  });
}

//функція для прослуховувача подій при відкритому popup
const popupListener = (e: Event) => {
  if (!refPopup.value?.contains(e.target as Node)) {
    popup.value.active = false;
    document.removeEventListener("click", popupListener);
  }
};

//функція скасування видалення
function handleCancel() {
  popup.value.active = false;
  document.removeEventListener("click", popupListener);
}

//функція підтвердження видалення
function deletePost(e: Event) {
  popup.value.active = false;
  emit("delete", popup.value.postId);
}
</script>

<template>
  <div class="filter-list">
    <div v-for="post in posts" class="filter__item">
      <span class="filter__item-location">
        <img src="/img/filter-location.svg" alt="loc" />
        <span class="city" v-for="city in post.city"> {{ city.name }} </span>
      </span>
      <strong class="filter__item-title">{{ post.title }}</strong>
      <p class="filter__item-text">
        {{ post.description }}
      </p>

      <strong class="filter__contact-title">Контакти</strong>
      <p class="filter__item-text">{{ post.phone }}</p>
      <p class="filter__item-text" v-if="post.phone2">{{ post.phone2 }}</p>
      <p class="filter__item-text" v-if="post.email">{{ post.email }}</p>

      <div class="filter__item-category">
        <span
          :class="[`filter__item-${category.id}`]"
          v-for="category in post.category"
        >
          {{ category.name }}
        </span>
      </div>
      <div class="buttons">
        <button @click="router.push(`/admin/${post.id}`)" class="edit">
          Редагувати
        </button>
        <button
          @click="openPopup({ postId: post.id, name: post.title })"
          class="delete"
        >
          Видалити
        </button>
      </div>
    </div>
  </div>
  <div class="popup-wrapper" :class="{ active: popup.active }">
    <div class="popup" ref="refPopup">
      <strong class="popup-title">Видалити?</strong>
      <p class="popup-text">Видалити повідомлення {{ popup.name }}</p>
      <div class="buttons">
        <button @click="handleCancel" class="cancel">Ні</button>
        <button @click="deletePost" class="delete">Так</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.city::after {
  content: ", ";
}

.city:last-child::after {
  content: "";
}

.filter__item {
  box-shadow: 0px 2px 7px 0px #00000040;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.delete {
  padding: 8px 16px;
  color: #000;
  background-color: rgb(255, 72, 72);
  width: fit-content;
  border-radius: 8px;
  transition: background-color 0.4s;
}
.delete:hover {
  background-color: rgb(218, 60, 60);
}
.edit {
  padding: 8px 16px;
  color: #fff;
  background-color: #2178c0;
  width: fit-content;
  border-radius: 8px;
  transition: background-color 0.4s;
}
.edit:hover {
  background-color: #1a5e96;
}

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
  pointer-events: unset;
  user-select: unset;
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
  color: rgb(255, 72, 72);
  font-size: 24px;
}

.cancel {
  padding: 8px 16px;
  color: #000;
  background-color: rgb(175, 175, 175);
  width: fit-content;
  border-radius: 8px;
  transition: background-color 0.4s;
}

.cancel:hover {
  background-color: rgb(145, 145, 145);
}
</style>
