<script setup lang="ts">
//сторінка взоду в адмінпанель

import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import ProviderLoginAdmin from "../components/ProviderLoginAdmin.vue";
import { saveSession } from "../utils/session";
import Field from "../components/Field.vue";
import LayoutAdmin from "../components/LayoutAdmin.vue";
import { serverUrl } from "@/utils/serverUrl";

const router = useRouter();

enum errorMessages {
  EmptyField = "Заповніть це поле!",
  Error = "Помилка входу. Спробуйте ще раз!",
  NotValid = "Заповніть всі поля!",
}

//змінні для елементів форми
const login = ref();
const password = ref("");

//змінні для керування станами
const disabled = ref(true);
const loading = ref(false);
const error = ref("");

//валідація форми
function validateForm() {
  if (login.value.length === 0 || password.value.length === 0) {
    disabled.value = true;
  } else {
    disabled.value = false;
    error.value = "";
  }
}

//очищення форми
function clearForm() {
  login.value = "";
  password.value = "";
}

//відправка форми
async function submitForm() {
  try {
    if (!disabled.value) {
      disabled.value = true;
      loading.value = true;
      const res = await fetch(`${serverUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login.value,
          password: password.value,
        }),
      });

      const data = await res.json();
      loading.value = false;
      if (res.ok) {
        saveSession(data.session);
        router.push("/admin-proposes");
      } else {
        error.value = data.message || errorMessages.Error;
        disabled.value = true;
        clearForm();
      }
    } else {
      error.value = errorMessages.NotValid;
      disabled.value = true;
    }
  } catch (e) {
    loading.value = false;
    error.value = errorMessages.Error;
    disabled.value = true;
    clearForm();
  }
}
</script>

<template>
  <ProviderLoginAdmin>
    <div class="page">
      <RouterLink to="/"
        ><img src="/img/icon.png" alt="getHelp" width="50"
      /></RouterLink>
      <main>
        <div class="info">Login: admin<br />Password: mCsKcG1g8a</div>
        <form @submit.prevent="submitForm">
          <Field
            title="Логін"
            type="text"
            name="login"
            v-model="login"
            :validate="validateForm"
          />
          <Field
            title="Пароль"
            type="password"
            name="password"
            v-model="password"
            :validate="validateForm"
          />
          <button :disabled="disabled" :class="{ disabled }">Увійти</button>
          <span class="error" v-if="error">{{ error }}</span>
          <span class="loading" v-if="loading">Надсилання...</span>
        </form>
      </main>
    </div>
  </ProviderLoginAdmin>
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

@media (max-width: 500px) {
  .page {
    padding: 12px;
  }
}
.admin-login-page {
  max-width: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

main {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.info {
  margin-bottom: 50px;
}
</style>
