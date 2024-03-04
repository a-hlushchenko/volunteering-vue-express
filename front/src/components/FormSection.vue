<script setup lang="ts">
//контактна форма

import { serverUrl } from "@/utils/serverUrl";
import Field from "./Field.vue";
import Popup from "./Popup.vue";

import { ref } from "vue";

const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);
const REG_EXP_PHONE = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
);

enum errorMessages {
  EmptyField = "Заповніть це поле!",
  Error = "Помилка. Спробуйте ще раз!",
  NotValid = "Заповніть всі поля!",
  Name = `Введіть ім'я!`,
  Email = `Введіть електронну пошту!`,
  Phone = `Введіть номер телефону!`,
}

//змінні для елементів форми
const name = ref("");
const nameError = ref("");
const email = ref("");
const emailError = ref("");
const phone = ref("");
const phoneError = ref("");
const message = ref("");
const messageError = ref("");
const type = ref("");
const time = ref("");
const checkbox = ref(false);

//змінні для керування станами
const disabled = ref(true);
const loading = ref(false);
const error = ref("");
const popup = ref(false);

//перевірка полів форми на валідність
function validate(e: Event) {
  const name = (e.target as HTMLInputElement).name;
  const value = (e.target as HTMLInputElement).value;

  switch (name) {
    case "name":
      if (value.length === 0) {
        nameError.value = errorMessages.EmptyField;
      } else {
        nameError.value = "";
      }
      break;
    case "email":
      if (value.length === 0) {
        emailError.value = errorMessages.EmptyField;
      } else if (!REG_EXP_EMAIL.test(value)) {
        emailError.value = errorMessages.Email;
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
    nameError.value ||
    emailError.value ||
    phoneError.value ||
    messageError.value ||
    !type.value ||
    !time.value
  ) {
    disabled.value = true;
  } else {
    disabled.value = false;
  }
}

//очищення форми
function clearForm() {
  name.value = "";
  email.value = "";
  phone.value = "";
  message.value = "";
  type.value = "";
  time.value = "";
  checkbox.value = false;
}

//відправка форми
async function submitForm() {
  try {
    if (!disabled.value) {
      disabled.value = true;
      loading.value = true;
      const res = await fetch(`${serverUrl}/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          phone: phone.value,
          message: message.value,
          type: type.value,
          time: time.value,
          checkbox: checkbox.value,
        }),
      });

      const data = await res.json();
      loading.value = false;
      if (res.ok) {
        clearForm();
        openPopup();
      } else {
        error.value = data.message || errorMessages.Error;
      }
    } else {
      error.value = errorMessages.NotValid;
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
</script>

<template>
  <section class="contact" id="contact">
    <form @submit.prevent="submitForm">
      <strong class="form-title">Зворотній зв'язок</strong>
      <Field
        :error="nameError"
        white
        placeholder="Іван Петренко"
        type="text"
        title="Ваше ім'я та призвіще *"
        name="name"
        v-model="name"
        @change="validate"
      />
      <Field
        :error="emailError"
        placeholder="i.petrenko@gmail.com"
        white
        type="email"
        title="Ваша пошта *"
        name="email"
        v-model="email"
        @change="validate"
      />
      <Field
        :error="phoneError"
        placeholder="+380681456587"
        white
        type="tel"
        title="Ваш телефон *"
        name="phone"
        v-model="phone"
        @change="validate"
      />
      <Field
        :error="messageError"
        textarea
        placeholder="Напишіть ваше запитання або прохання."
        white
        type="message"
        title="Коментар*"
        name="message"
        v-model="message"
        @change="validate"
      />
      <div class="bottom-fields">
        <select @change="validate" v-model="type">
          <option disabled value="">Тип*</option>
          <option>Прохання</option>
          <option>Пропозиція</option>
        </select>
        <select @change="validate" v-model="time">
          <option disabled value="">Термін активності*</option>
          <option>12 годин</option>
          <option>1 день</option>
          <option>3 дні</option>
          <option>5 днів</option>
          <option>1 тиждень</option>
          <option>2 тижні</option>
          <option>3 тижні</option>
          <option>1 місяць</option>
        </select>
        <div class="checkbox">
          <input
            type="checkbox"
            name="checkbox"
            id="checkbox"
            v-model="checkbox"
          />
          <label for="checkbox">терміново</label>
        </div>
      </div>
      <button :disabled="disabled" :class="{ disabled }">Відправити</button>
      <span class="error" v-if="error">{{ error }}</span>
      <span class="loading" v-if="loading">Надсилання...</span>
    </form>
  </section>
  <Popup
    title="Відправлено успішно!"
    text="Ваше повідомлення скоро буде опубліковано."
    :popup="popup"
  />
</template>

<style scoped>
.contact {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  padding: 100px 20px 50px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  background-color: #0f2f43;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  background-image: url("/img/gray-line.svg");
  background-repeat: no-repeat;
}

.form-title {
  color: #fff;
  font-size: 24px;
}

select {
  background-color: #fff;
  border-radius: 4px;
  padding: 4px;
}

.bottom-fields {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

label {
  margin: 0;
}

button {
  background-color: #2178c0;
  color: #fff;
  border-radius: 4px;
  padding: 12px;
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  transition: color 0.4s, background-color 0.4s;
}

button.disabled {
  background-color: rgb(175, 175, 175) !important;
  cursor: default;
  color: #000;
}

@media (max-width: 550px) {
  .bottom-fields {
    flex-direction: column;
    align-items: start;
  }

  form {
    padding: 24px;
  }
}
</style>
