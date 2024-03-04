<script setup lang="ts">
//секція пропозиції та прохання

import { ref, type Component, onMounted } from "vue";
import Posts from "./Posts.vue";
import type { Post } from "@/types/Post";
import { getTypeList, getLocationList, getCategoryList } from "@/utils/getData";
import { serverUrl } from "@/utils/serverUrl";

//перемикання табів (пропозиції, прохання)
const currentTab = ref<string>("Пропозиції");

const tabs: { [key: string]: Component } = {
  Пропозиції: Posts,
  Прохання: Posts,
};

//змінні для керування станами
const error = ref("");
const loading = ref(false);
const openLocation = ref(false);
const openCategory = ref(false);

//змінні для даних з серверу
const locationList = ref([]);
const categoryList = ref([]);
const proposeList = ref<Post[]>([]);
const requestList = ref<Post[]>([]);

//змінні для вибраних фільтрів
const activeLocations = ref([]);
const activeCategories = ref([]);

//отримання списку постів
async function getList() {
  try {
    openLocation.value = false;
    openCategory.value = false;
    const res = await fetch(`${serverUrl}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locations: activeLocations.value,
        categories: activeCategories.value,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      filterByType(data.postList);
      loading.value = false;
    } else {
      loading.value = false;
      error.value = data.message;
    }
  } catch (e) {
    loading.value = false;
    error.value = "Помилка отримання даних. Спробуйте оновити сторінку.";
  }
}

//функція обробки вибору фільтрів
function handlefilter(array: number[], id: number) {
  const index = array.indexOf(id);
  if (index === -1) {
    array.push(id);
  } else {
    array.splice(index, 1);
  }
}

//розподілення отриманих постів за типами (пропозиції, прохання)
function filterByType(posts: Post[]) {
  proposeList.value = [];
  requestList.value = [];
  posts.map((post) => {
    if (post.type_id === 2) {
      requestList.value.push(post);
    } else {
      proposeList.value.push(post);
    }
  });
}

//отримання даних при запуску сторінки
onMounted(async () => {
  getList();
  locationList.value = await getLocationList();
  categoryList.value = await getCategoryList();
});
</script>

<template>
  <div class="filter__wrapper">
    <h2 class="text-color-white">Пропозиції та прохання</h2>

    <div class="filter__content">
      <div class="filter__heading">
        <div class="filter__heading-item location">
          <div
            @click="openLocation = !openLocation"
            class="filter__heading-top"
          >
            Локація
          </div>
          <div
            :class="[
              'filter__heading-list',
              'location',
              { active: openLocation },
            ]"
          >
            <div
              v-for="{ id, name } in locationList"
              :key="id"
              @click="handlefilter(activeLocations, id)"
              :class="[
                'filter__heading-list-item',
                { active: activeLocations.includes(id) },
              ]"
            >
              {{ name }}
            </div>

            <div class="filter__buttons-wrapper">
              <button
                @click="activeLocations = []"
                class="filter__clear-button"
              >
                Очистити
              </button>

              <button @click="getList" class="filter__apply-button">
                Застосувати
              </button>
            </div>
          </div>
        </div>

        <div class="filter__heading-item category">
          <div
            class="filter__heading-top"
            @click="openCategory = !openCategory"
          >
            Категорія
          </div>
          <div
            class="filter__heading-list"
            :class="[
              'filter__heading-list',
              'category',
              { active: openCategory },
            ]"
          >
            <div
              v-for="{ id, name } in categoryList"
              :key="id"
              @click="handlefilter(activeCategories, id)"
              :class="[
                'filter__heading-list-item',
                'category',
                `filter__item-${id}`,
                { active: activeCategories.includes(id) },
              ]"
            >
              {{ name }}
            </div>

            <div class="filter__buttons-wrapper">
              <button
                @click="activeCategories = []"
                class="filter__clear-button"
              >
                Очистити
              </button>

              <button @click="getList" class="filter__apply-button">
                Застосувати
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-section-list">
        <button
          v-for="(component, label) in tabs"
          :key="label"
          :class="['filter-section', { active: currentTab === label }]"
          @click="currentTab = String(label)"
        >
          {{ label }}
        </button>
      </div>
      <span class="error" v-if="error">{{ error }}</span>
      <span class="loading" v-if="loading">Отримання...</span>
      <component
        :is="tabs[currentTab]"
        :posts="currentTab === 'Прохання' ? requestList : proposeList"
      ></component>
    </div>
  </div>
</template>

<style>
.filter__wrapper {
  padding: 50px 20px;
  max-width: 1320px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 auto;
}

.filter__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter__heading {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.filter__heading-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter__heading-top {
  background-image: url("/img/filter-arrow.svg");
}

.filter__heading-top {
  background-color: #fff;
  border-radius: 12px;
  padding: 8px;
  color: #000;
  background-image: url("/img/filter-arrow-top.svg");
  background-image: url("/img/filter-arrow.svg");
  background-repeat: no-repeat;
  background-position: center right 12px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.filter__heading-list.active .filter__heading-top {
  background-image: url("/img/filter-arrow-top.svg");
}

.location .filter__heading-top:before {
  content: "";
  display: block;
  width: 14px;
  height: 17px;
  background-image: url("/img/filter-location.svg");
  background-size: 14px 17px;
}

.category .filter__heading-top:before {
  content: "";
  display: block;
  width: 14px;
  height: 17px;
  background-repeat: no-repeat;
  background-image: url("/img/filter-category.svg");
  background-size: 14px 17px;
}

.filter__heading-list {
  display: grid;
  overflow: hidden;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background-color: #fff;
  border-radius: 12px;
  height: 0px;
  padding: 0px 8px;
}

.filter__heading-list.active {
  padding: 8px;
  height: auto;
}

.filter__heading-list-item {
  display: flex;
  gap: 4px;
  align-items: center;
  color: #000;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.filter__heading-list-item:hover {
  background-color: #eee;
}

.filter__heading-list-item.active {
  background-color: #2178c0;
  color: #fff;
}

.location .filter__heading-list-item::before {
  content: "";
  display: block;
  width: 14px;
  height: 17px;
  background-image: url("/img/filter-location.svg");
  background-size: 14px 17px;
}

.filter__heading-list-item:last-child {
  margin-bottom: 8px;
}

.filter__clear-button {
  background-color: #fff;
  border: 1px solid #2178c0;
  border-radius: 12px;
  color: var(--primary-blue);
  width: 100%;
  font-weight: bold;
}

.filter__apply-button {
  background-color: #2178c0;
  border-radius: 12px;
  color: #fff;
  width: 100%;
  padding: 10px;
  font-weight: bold;
}

.filter__buttons-wrapper {
  grid-column: 1 / 3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.filter-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.filter__item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #fff;
  color: #000;
  border-radius: 12px;
  padding: 25px;
}

.filter__item-location {
  font-size: 12px;
}

.filter__item-text {
  font-size: 14px;
  line-height: 120%;
}

.filter__item-category {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.filter__item-category > span {
  padding: 4px 8px;
  border-radius: 8px;
  background-color: #eee;
  font-size: 12px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.filter__heading-list-item.category {
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter__item-category > span::before,
.filter__heading-list-item.category:before {
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  background-size: 16px 16px;
}

.filter__item-6::before {
  background-image: url("/img/home.svg");
}

.filter__item-2::before {
  background-image: url("/img/clothes.svg");
}

.filter__item-3::before {
  background-image: url("/img/military.svg");
}

.filter__item-4::before {
  background-image: url("/img/humanitarian.svg");
}

.filter__item-5::before {
  background-image: url("/img/psychological.svg");
}

.filter__item-1::before {
  background-image: url("/img/eat.svg");
}

.filter__item-7::before {
  background-image: url("/img/machinary.svg");
}

.filter-section-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: #151515;
  grid-column-gap: 20px;
  border-radius: 12px;
}

.filter-section {
  color: #000;
  font-size: 20px;
  padding: 12px;
  background-color: #fff;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
}

.filter-section.active {
  border-bottom: 5px solid #2178c0;
}

@media (max-width: 1024px) {
  .filter-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filter-list {
    display: flex;
    flex-direction: column;
  }

  .filter__heading {
    display: flex;
    flex-direction: column;
  }
}

@media screen and (max-width: 570px) {
  .filter-list {
    grid-template-columns: 1fr;
  }
}
</style>
