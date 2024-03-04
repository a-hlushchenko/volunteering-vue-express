<script setup lang="ts">
//компонент постів

import type { Post } from "@/types/Post";
defineProps<{ posts: Post[] }>();
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
</style>
