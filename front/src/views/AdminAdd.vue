<script setup lang="ts">
//сторінка додавання нового поста

import { ref, onMounted } from "vue";
import { getSession } from "../utils/session";
import Field from "../components/Field.vue";
import Popup from "../components/Popup.vue";
import { RouterLink, useRouter } from "vue-router";
import LayoutAdmin from "@/components/LayoutAdmin.vue";
import { getTypeList, getLocationList, getCategoryList } from "@/utils/getData";
import { serverUrl } from "@/utils/serverUrl";

const router = useRouter();

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
const date = ref("");
const location = ref([]);
const category = ref([]);

//змінні для даних з серверу
const locationList = ref([]);
const categoryList = ref([]);
const typeList = ref([]);

//змінні для керування станами
const disabled = ref(true);
const loading = ref(false);
const error = ref("");

const popup = ref(false);

//очищення форми
function clearForm() {
  title.value = "";
  message.value = "";
  phone.value = "";
  phone2.value = "";
  email.value = "";
  type.value = "";
  date.value = "";
  location.value = [];
  category.value = [];
}

//отримання дати закінчення дії поста
function getEndDate(date: number) {
  const currentDate = new Date();
  const endDate = new Date(currentDate.getTime() + date);
  return endDate;
}

//перевірка полів форми на валідність
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
    !date.value ||
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
      loading.value = true;
      const res = await fetch(`${serverUrl}/admin/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.value,
          description: message.value,
          phone: phone.value,
          phone2: phone2.value,
          email: email.value,
          type: type.value,
          date: getEndDate(Number(date.value)),
          locations: location.value,
          categories: category.value,
          token: getSession(),
        }),
      });
      const data = await res.json();
      loading.value = false;
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
      loading.value = false;
    }
  } catch (e) {
    loading.value = false;
    error.value = errorMessages.Error;
    disabled.value = false;
  }
}

// відкривання pupup
function openPopup() {
  popup.value = true;

  document.addEventListener("click", () => {
    popup.value = false;
  });

  setTimeout(() => {
    popup.value = false;
    document.removeEventListener("click", () => {
      popup.value = false;
    });
  }, 5000);
}

//отримання даних при запуску сторінки
onMounted(async () => {
  typeList.value = await getTypeList();
  locationList.value = await getLocationList();
  categoryList.value = await getCategoryList();
});
</script>

<template>
  <LayoutAdmin>
    <h1>Створити нове повідомлення</h1>
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
        <label>Термін активності*</label>

        <select @change="validate" v-model="date">
          <option disabled value="">Не обрано</option>
          <option :value="1000 * 60 * 60 * 12">12 годин</option>
          <option :value="1000 * 60 * 60 * 24">1 день</option>
          <option :value="1000 * 60 * 60 * 24 * 3">3 дні</option>
          <option :value="1000 * 60 * 60 * 24 * 5">5 днів</option>
          <option :value="1000 * 60 * 60 * 24 * 7">1 тиждень</option>
          <option :value="1000 * 60 * 60 * 24 * 14">2 тижні</option>
          <option :value="1000 * 60 * 60 * 24 * 21">3 тижні</option>
          <option :value="1000 * 60 * 60 * 24 * 30">1 місяць</option>
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
      title="Опубліковано успішно!"
      text="Це повідомлення тепер доступне для користувачів."
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
