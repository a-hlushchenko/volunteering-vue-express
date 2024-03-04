<script setup lang="ts">
//сторінка редагування поста

import LayoutAdmin from "@/components/LayoutAdmin.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSession } from "../utils/session";
import Field from "@/components/Field.vue";
import Popup from "@/components/Popup.vue";
import { getTypeList, getLocationList, getCategoryList } from "@/utils/getData";
import type { Post } from "@/types/Post";
import { serverUrl } from "@/utils/serverUrl";

const router = useRouter();
const route = useRoute();
const postId = ref(route.params.postId);

const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);
const REG_EXP_PHONE = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
);

enum errorMessages {
  EmptyField = "Заповніть це поле!",
  Error = "Помилка. Спробуйте ще раз!",
  NotValid = "Заповніть всі поля!",
  Email = `Введіть електронну пошту!`,
  Phone = `Введіть номер телефону!`,
  GetError = `Помилка отримання даних. Cпробуйте оновити сторінку!`,
}

//змінні для елементів форми
const title = ref("");
const titleError = ref("");

const message = ref("");
const messageError = ref("");

const phone = ref("");
const phoneError = ref("");

const phone2 = ref("");
const phone2Error = ref("");

const email = ref("");
const emailError = ref("");

const type = ref("");
const location = ref<number[]>([]);
const category = ref<number[]>([]);

//змінні для даних з серверу
const locationList = ref([]);
const categoryList = ref([]);
const typeList = ref([]);

//змінні для керування станами
const disabled = ref(false);
const loading = ref("");
const error = ref("");

const popup = ref(false);

//отримання даних поста
async function getPost() {
  try {
    loading.value = "Отримання даних...";
    const res = await fetch(`${serverUrl}/admin/getpost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setData(data.post);
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

//запис отриманих даних в змінні
function setData(post: Post) {
  title.value = post.title;
  message.value = post.description;
  phone.value = post.phone;
  phone2.value = post.phone2;
  email.value = post.email;
  type.value = String(post.type_id);
  post.city.map(({ id }: { id: number }) => {
    location.value.push(id);
  });
  post.category.map(({ id }: { id: number }) => {
    category.value.push(id);
  });
}

//очищення форми
function clearForm() {
  title.value = "";
  message.value = "";
  phone.value = "";
  phone2.value = "";
  email.value = "";
  type.value = "";
  location.value = [];
  category.value = [];
}

// валідація форми
function validate(e: Event) {
  const name = (e.target as HTMLInputElement).name;
  const value = (e.target as HTMLInputElement).value;

  switch (name) {
    case "title":
      if (value.length === 0) {
        titleError.value = errorMessages.EmptyField;
      } else {
        titleError.value = "";
      }
      break;
    case "email":
      if (value.length > 0) {
        if (!REG_EXP_EMAIL.test(value)) {
          emailError.value = errorMessages.Email;
        } else {
          emailError.value = "";
        }
      } else {
        emailError.value = "";
      }
      break;
    case "phone":
      if (value.length === 0) {
        phoneError.value = errorMessages.EmptyField;
      } else if (!REG_EXP_PHONE.test(value)) {
        phoneError.value = errorMessages.Phone;
      } else {
        phoneError.value = "";
      }
      break;
    case "phone2":
      if (value.length > 0) {
        if (!REG_EXP_PHONE.test(value)) {
          phone2Error.value = errorMessages.Phone;
        } else {
          phone2Error.value = "";
        }
      } else {
        phone2Error.value = "";
      }
      break;
    case "message":
      if (value.length === 0) {
        messageError.value = errorMessages.EmptyField;
      } else {
        messageError.value = "";
      }
      break;
    default:
      break;
  }
  if (
    titleError.value ||
    phoneError.value ||
    messageError.value ||
    phone2Error.value ||
    emailError.value ||
    !title.value ||
    !phone.value ||
    !message.value ||
    !type.value ||
    location.value.length === 0 ||
    category.value.length === 0
  ) {
    disabled.value = true;
  } else {
    disabled.value = false;
  }
}

//відправка форми
async function submitForm() {
  try {
    if (!disabled.value) {
      disabled.value = true;
      loading.value = "Надсилання...";
      const res = await fetch(`${serverUrl}/admin/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId.value,
          title: title.value,
          description: message.value,
          phone: phone.value,
          phone2: phone2.value,
          email: email.value,
          type: type.value,
          locations: location.value,
          categories: category.value,
          token: getSession(),
        }),
      });
      const data = await res.json();
      loading.value = "";
      if (res.ok) {
        error.value = "";
        clearForm();
        openPopup();
      } else {
        if (!data.isAdmin) {
          router.push("/admin-login");
        }
        error.value = data.message || errorMessages.Error;
      }
    } else {
      error.value = errorMessages.NotValid;
      loading.value = "";
    }
  } catch (e) {
    loading.value = "";
    error.value = errorMessages.Error;
    disabled.value = false;
  }
}

// відкриття popup
function openPopup() {
  popup.value = true;

  const listener = () => {
    popup.value = false;
    router.back();
    document.removeEventListener("click", listener);
  };

  document.addEventListener("click", listener);

  setTimeout(() => {
    if (popup.value) {
      popup.value = false;
      router.back();
      document.removeEventListener("click", listener);
    }
  }, 3000);
}

//отримання даних при запуску сторінки
onMounted(async () => {
  getPost();
  typeList.value = await getTypeList();
  locationList.value = await getLocationList();
  categoryList.value = await getCategoryList();
});
</script>

<template>
  <LayoutAdmin>
    <h1>Оновити повідомлення</h1>
    <form @submit.prevent="submitForm">
      <Field
        title="Заголовок*"
        name="title"
        type="string"
        v-model="title"
        @change="validate"
        :error="titleError"
      />
      <Field
        textarea
        title="Повідомлення*"
        name="message"
        type="string"
        v-model="message"
        @change="validate"
        :error="messageError"
      />
      <Field
        title="Номер телефону*"
        name="phone"
        type="string"
        v-model="phone"
        @change="validate"
        :error="phoneError"
      />
      <Field
        title="Другий номер телефону"
        name="phone2"
        type="string"
        v-model="phone2"
        @change="validate"
        :error="phone2Error"
      />
      <Field
        title="Пошта"
        name="email"
        type="string"
        v-model="email"
        @change="validate"
        :error="emailError"
      />
      <div class="field">
        <label>Тип повідомлення*</label>
        <select @change="validate" v-model="type">
          <option disabled value="">Не обрано</option>
          <option v-for="{ id, name } in typeList" :value="id" :key="id">
            {{ name }}
          </option>
        </select>
      </div>
      <div class="field">
        <label>Локації*</label>

        <select @change="validate" v-model="location" multiple size="8">
          <option disabled value="">Не обрано</option>
          <option v-for="{ id, name } in locationList" :value="id" :key="id">
            {{ name }}
          </option>
        </select>
      </div>
      <span>Використовуйте <code>ctrl</code> для множинного вибору.</span>
      <div class="field">
        <label>Категорії*</label>

        <select @change="validate" v-model="category" multiple size="8">
          <option disabled value="">Не обрано</option>
          <option v-for="{ id, name } in categoryList" :value="id" :key="id">
            {{ name }}
          </option>
        </select>
      </div>

      <button :disabled="disabled" :class="{ disabled }">Опублікувати</button>
      <span class="error" v-if="error">{{ error }}</span>
      <span class="loading" v-if="loading">Надсилання...</span>
    </form>

    <Popup
      title="Оновлено успішно!"
      text="Оновлене повідомлення доступне для користувачів."
      :popup="popup"
    />
  </LayoutAdmin>
</template>

<style scoped>
h1 {
  font-size: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
}

select {
  border: 1px solid #000;
  border-radius: 4px;
  padding: 4px;
}

button {
  padding: 8px 16px;
  border-radius: 8px;
  background-color: hsla(160, 100%, 37%, 1);
  color: #000;
  font-weight: 500;
  transition: background-color 0.4s;
}

button.disabled {
  background-color: rgb(175, 175, 175) !important;
  cursor: default;
}

button:hover {
  background-color: hsla(160, 100%, 32%, 1);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}
</style>
